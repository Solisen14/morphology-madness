from playwright.sync_api import sync_playwright
from pathlib import Path
from collections import Counter
import shutil

folder=Path(__file__).parent.parent

def mount(browser,width=1280,height=900):
    page=browser.new_page(viewport={'width':width,'height':height})
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.set_content((folder/'index.html').read_text(),wait_until='domcontentloaded')
    page.add_style_tag(content=(folder/'styles.css').read_text())
    page.add_script_tag(content=(folder/'morpheme-bank.js').read_text())
    page.add_script_tag(content=(folder/'data.js').read_text())
    page.add_script_tag(content=(folder/'script.js').read_text())
    return page,errors

def select_card(page,type,id):
    found=page.evaluate('''([type,id])=>{
      const buttons=[...document.querySelectorAll('.bank-column[data-type="'+type+'"] .part-card')];
      const b=buttons.find(x=>x.querySelector('.card-text').textContent.replaceAll('-','')===id);
      if(!b||b.disabled)return false;
      b.click();return true;
    }''',[type,id])
    assert found,(type,id,[x.inner_text() for x in page.locator('.bank-column[data-type="'+type+'"] .part-card').all()])

def current_record(page,kind):
    return page.evaluate('''kind=>window.MM_DATA[kind].find(x=>x.clue.trim()===document.getElementById('clue').textContent.trim())''',kind)

with sync_playwright() as pw:
    browser_args={'headless':True,'args':['--no-sandbox']}
    system_chromium=shutil.which('chromium') or shutil.which('chromium-browser')
    if system_chromium:
        browser_args['executable_path']=system_chromium
    b=pw.chromium.launch(**browser_args)
    page,errors=mount(b)
    assert page.locator('.mode-card').count()==3
    page.select_option('#subject','science');page.select_option('#level','master');page.click('#start')
    assert page.locator('#game').is_visible()
    for round_no in range(5):
        record=current_record(page,'real');assert record
        for t in ['prefix','base','suffix']:
            if record['parts'][t]:select_card(page,t,record['parts'][t])
        assert page.locator('#word-preview').inner_text()==record['answer']
        page.click('#check');assert 'You built it' in page.locator('#feedback').inner_text()
        page.locator('#feedback button').click()
    assert page.locator('#results').is_visible();assert '5 of 5' in page.locator('#results').inner_text()
    assert not errors,errors
    print('PASS: Word Wizard 5 master-level rounds, including optional parts; results page')
    page.close()

    page,errors=mount(b)
    page.click('[data-mode="madness"]');page.select_option('#subject','math');page.click('#start')
    record=current_record(page,'creative');assert record
    root=record['root'];select_card(page,'base',root)
    for t,tag in [('prefix',record['prefixTag']),('suffix',record['suffixTag'])]:
        valid=page.evaluate('''([t,tag])=>{
          const items=t==='prefix'?window.MM_DATA.prefixes:window.MM_DATA.suffixes;
          return items.filter(x=>x.tags.includes(tag)).map(x=>x.id);
        }''',[t,tag]);
        rendered=page.locator('.bank-column[data-type="'+t+'"] .card-text').all_inner_texts()
        match=next((v for v in valid if (v+'-' if t=='prefix' else '-'+v) in rendered),None)
        assert match,(t,tag,rendered)
        select_card(page,t,match)
    page.click('#check');assert 'Strong meaning match' in page.locator('#feedback').inner_text()
    page.locator('#feedback button').click()
    # deliberately mismatched construction, then reflective alternative
    record=current_record(page,'creative');select_card(page,'base',record['root'])
    prefixes=page.evaluate('''()=>window.MM_DATA.prefixes''')
    visible=page.locator('.bank-column[data-type="prefix"] .card-text').all_inner_texts()
    wrong=next(x['id'] for x in prefixes if not record['prefixTag'] in x['tags'] and x['text'] in visible)
    select_card(page,'prefix',wrong)
    page.click('#check');assert page.locator('#defense').is_visible()
    page.fill('#defense-text','I propose this alternative meaning because the prefix and base together describe an imaginary exception to the clue.')
    page.check('#defense-check');page.click('#defend')
    assert 'self-reviewed' in page.locator('#feedback').inner_text().lower()
    assert not errors,errors
    print('PASS: Meaning Madness tag-matched answer and explained alternative')
    page.close()

    page,errors=mount(b)
    page.click('[data-mode="lab"]')
    page.select_option('#subject','english')
    page.click('#start')
    assert page.locator('#lab-machine').is_visible()
    assert page.locator('.workbench').is_hidden()
    assert page.locator('#card-bank').is_hidden()
    assert page.locator('#definition-area').is_hidden()
    assert page.locator('#lab-reveal').is_hidden()
    assert page.locator('#reel-prefix').inner_text()=='?'
    page.click('#spin')
    assert page.locator('#spin').is_disabled()
    assert page.locator('#definition-area').is_hidden()
    page.wait_for_timeout(1250)
    assert page.locator('[data-reel="prefix"]').get_attribute('class').find('has-stopped')>=0
    assert 'is-spinning' in page.locator('[data-reel="suffix"]').get_attribute('class')
    assert page.locator('#definition-area').is_hidden()
    page.locator('#definition-area').wait_for(state='visible',timeout=6000)
    assert page.locator('#lab-reveal').is_visible()
    assert 'is-spinning' not in page.locator('[data-reel="suffix"]').get_attribute('class')
    assert page.locator('#lab-word').inner_text()==''.join(page.locator('#reel-'+part).inner_text().replace('-','') for part in ['prefix','base','suffix'])
    assert page.locator('#definition-word').inner_text()==page.locator('#lab-word').inner_text()
    assert page.locator('#hint').is_hidden()
    page.fill('#definition','An imaginary English literary practice involving these three meaningful parts together.')
    page.once('dialog',lambda dialog:dialog.accept())
    page.click('#spin')
    assert page.locator('#definition-area').is_hidden()
    page.locator('#definition-area').wait_for(state='visible',timeout=6000)
    assert page.locator('#definition').input_value()==''
    page.fill('#definition','An imaginary English literary practice involving this prefix, root and ending.')
    page.click('#check')
    assert page.locator('#self-review').is_visible()
    page.fill('#definition','A revised imaginary language device with three carefully explained morphemes.')
    assert page.locator('#self-review').is_hidden()
    page.click('#check')
    assert page.locator('#self-review').is_visible()
    page.check('#review-one');page.check('#review-two')
    page.click('#finish-invention')
    assert 'Invention recorded' in page.locator('#feedback').inner_text()
    assert not errors,errors
    print('PASS: Word Laboratory sequential reels, definition gate, re-spin and self-review')
    page.close()

    page,errors=mount(b,width=375,height=812)
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'), 'Setup horizontal overflow'
    page.click('[data-mode="lab"]');page.click('#start')
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'), 'Game horizontal overflow'
    page.emulate_media(reduced_motion='reduce')
    page.click('#spin')
    page.locator('#definition-area').wait_for(state='visible',timeout=3000)
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'), 'Spun word horizontal overflow'
    assert not errors,errors
    print('PASS: 375px mobile width without horizontal overflow')
    page.close()

    page,errors=mount(b)
    page.click('#start')
    assert page.locator('#game').is_visible()
    page.click('#leave')
    assert page.locator('#exit-dialog').is_visible()
    page.click('#stay')
    assert page.locator('#game').is_visible()
    page.click('#back')
    assert page.locator('#exit-dialog').is_visible()
    page.click('#confirm-exit')
    assert page.locator('#setup').is_visible()
    assert not errors,errors
    print('PASS: Exit controls preserve state on cancel and return to menu on confirm')
    page.close()

    page,errors=mount(b)
    page.click('[data-mode="lab"]');page.click('#start')
    page.click('#spin')
    page.click('#back');page.click('#confirm-exit')
    assert page.locator('#setup').is_visible()
    page.wait_for_timeout(2700)
    assert page.locator('#game').is_hidden()
    assert not errors,errors
    print('PASS: Leaving during a spin cancels timers without crashing')
    page.close()
    b.close()