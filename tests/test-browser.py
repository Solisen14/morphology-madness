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
    guide=page.locator('.teacher-guide')
    assert guide.count()==1
    assert guide.locator('#teacher-guide-title').inner_text()=='Teachers: How to Use This Tool'
    assert guide.locator('.teacher-guide-options p').count()==3
    for name in ['Word Wizard | Building Foundations','Meaning Madness | Applying Understanding','Word Laboratory | Creating and Explaining']:
        assert name in guide.inner_text()
    assert page.evaluate('''()=>{
      const guide=document.querySelector('.teacher-guide');
      const choose=document.querySelector('#mode-title');
      return !!guide && !!choose && (guide.compareDocumentPosition(choose) & Node.DOCUMENT_POSITION_FOLLOWING)!==0;
    }''')
    assert page.locator('.mode-card').count()==3
    assert not errors,errors
    page.close()
    small,small_errors=mount(b,width=375,height=812)
    assert small.locator('.teacher-guide').is_visible()
    assert small.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),'Teacher guide mobile overflow'
    assert not small_errors,small_errors
    small.close()
    print('PASS: Teacher guide visible above Choose your game on desktop and mobile')



    # Ontario ENL1W: all 99 words require 2+ meaningful parts; existing
    # English remains separate and the same modes and difficulties work.
    enl,enl_errors=mount(b)
    assert enl.locator('.mode-card').count()==3
    assert enl.locator('#subject option[value="english"]').inner_text()=='English'
    assert enl.locator('#subject option[value="grade9english"]').inner_text()=='Grade 9 English'
    enl_real=enl.evaluate('''()=>window.MM_DATA.real.filter(x=>x.subject==='grade9english')''')
    assert len(enl_real)==99
    assert len(set(x['answer'] for x in enl_real))==99
    for word in enl_real:
        parts=[word['parts'][t] for t in ['prefix','base','suffix'] if word['parts'][t] is not None]
        assert len(parts)>=2,word['answer']
        assert ''.join(parts)==word['answer'],word['answer']
        assert enl.evaluate('''id=>window.MM_DATA.roots.some(r=>r.id===id&&r.subjects.includes('grade9english'))''',word['parts']['base']),word['answer']
    assert not enl_errors,enl_errors
    enl.close()
    for play_mode in ['wizard','madness','lab']:
        for level,expected in [('apprentice',3),('inventor',6),('master',10)]:
            sample,errors=mount(b,width=375 if level=='apprentice' else 1280,height=900)
            if play_mode!='wizard':sample.click('[data-mode="'+play_mode+'"]')
            sample.select_option('#subject','grade9english')
            sample.select_option('#level',level)
            if play_mode=='lab':sample.emulate_media(reduced_motion='reduce')
            sample.click('#start')
            assert sample.locator('#category-chip').inner_text()=='GRADE 9 ENGLISH'
            if play_mode=='lab':
                sample.click('#spin')
                sample.locator('#definition-area').wait_for(state='visible',timeout=3000)
                value=sample.locator('#reel-base').inner_text()
                assert sample.evaluate('''value=>window.MM_DATA.roots.some(r=>r.text===value&&r.subjects.includes('grade9english'))''',value)
                assert sample.locator('#lab-word').inner_text()!=''
            else:
                record=current_record(sample,'real' if play_mode=='wizard' else 'creative')
                assert record and record['subject']=='grade9english'
                for part in ['prefix','base','suffix']:
                    assert sample.locator('.bank-column[data-type="'+part+'"] .part-card').count()==expected,(play_mode,level,part)
                if play_mode=='wizard':
                    for part in ['prefix','base','suffix']:
                        if record['parts'][part]:select_card(sample,part,record['parts'][part])
                    assert sample.locator('#word-preview').inner_text()==record['answer']
                    sample.click('#check')
                    assert 'You built it' in sample.locator('#feedback').inner_text()
                else:
                    select_card(sample,'base',record['root'])
                    for part,tag in [('prefix',record['prefixTag']),('suffix',record['suffixTag'])]:
                        labels=sample.locator('.bank-column[data-type="'+part+'"] .card-text').all_inner_texts()
                        candidates=sample.evaluate('''([part,tag])=>(part==='prefix'?window.MM_DATA.prefixes:window.MM_DATA.suffixes).filter(x=>x.tags.includes(tag)).map(x=>x.text)''',[part,tag])
                        selected=next((x for x in labels if x in candidates),None)
                        assert selected,(part,tag,labels)
                        select_card(sample,part,selected.replace('-',''))
                    sample.click('#check')
                    assert 'Strong meaning match' in sample.locator('#feedback').inner_text()
            assert sample.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),(play_mode,level,'horizontal overflow')
            assert not errors,errors
            sample.close()
    print('PASS: ENL1W all 99 puzzles and all three modes and difficulties')

    # Ontario SNC1W 2022: verify all new real words and all 3 existing games
    # at all three levels. Keep the basic Science subject and 3 cards intact.
    sci,sci_errors=mount(b)
    assert sci.locator('.mode-card').count()==3
    assert sci.locator('#subject option[value="grade9science"]').inner_text()=='Grade 9 Science'
    assert sci.locator('#subject option[value="science"]').inner_text()=='Science'
    science_words=sci.evaluate('''()=>window.MM_DATA.real.filter(q=>q.subject==='grade9science')''')
    assert len(science_words)==89
    assert len(set(x['answer'] for x in science_words))==len(science_words)
    for word in science_words:
        parts=[word['parts'][t] for t in ['prefix','base','suffix'] if word['parts'][t] is not None]
        assert len(parts)>=2,word['answer']
        assert ''.join(parts)==word['answer'],word['answer']
        assert sci.evaluate('''id=>window.MM_DATA.roots.some(r=>r.id===id&&r.subjects.includes('grade9science'))''',word['parts']['base'])
    assert not sci_errors,sci_errors
    sci.close()
    for play_mode in ['wizard','madness','lab']:
        for level,expected in [('apprentice',3),('inventor',6),('master',10)]:
            sample,errors=mount(b,width=375 if level=='apprentice' else 1280,height=900)
            if play_mode!='wizard':sample.click('[data-mode="'+play_mode+'"]')
            sample.select_option('#subject','grade9science')
            sample.select_option('#level',level)
            if play_mode=='lab':sample.emulate_media(reduced_motion='reduce')
            sample.click('#start')
            assert sample.locator('#category-chip').inner_text()=='GRADE 9 SCIENCE'
            if play_mode=='lab':
                sample.click('#spin')
                sample.locator('#definition-area').wait_for(state='visible',timeout=3000)
                value=sample.locator('#reel-base').inner_text()
                assert sample.evaluate('''value=>window.MM_DATA.roots.some(r=>r.text===value&&r.subjects.includes('grade9science'))''',value)
                assert sample.locator('#lab-word').inner_text()!=''
            else:
                record=current_record(sample,'real' if play_mode=='wizard' else 'creative')
                assert record and record['subject']=='grade9science'
                for part in ['prefix','base','suffix']:
                    assert sample.locator('.bank-column[data-type="'+part+'"] .part-card').count()==expected,(play_mode,level,part)
                if play_mode=='wizard':
                    for part in ['prefix','base','suffix']:
                        if record['parts'][part]:select_card(sample,part,record['parts'][part])
                    assert sample.locator('#word-preview').inner_text()==record['answer']
                    sample.click('#check')
                    assert 'You built it' in sample.locator('#feedback').inner_text()
                else:
                    select_card(sample,'base',record['root'])
                    for part,tag in [('prefix',record['prefixTag']),('suffix',record['suffixTag'])]:
                        texts=sample.locator('.bank-column[data-type="'+part+'"] .card-text').all_inner_texts()
                        allowed=sample.evaluate('''([part,tag])=>(part==='prefix'?window.MM_DATA.prefixes:window.MM_DATA.suffixes).filter(r=>r.tags.includes(tag)).map(r=>r.text)''',[part,tag])
                        chosen=next((x for x in texts if x in allowed),None)
                        assert chosen,(part,tag,texts)
                        select_card(sample,part,chosen.replace('-',''))
                    sample.click('#check')
                    assert 'Strong meaning match' in sample.locator('#feedback').inner_text()
            assert sample.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),(play_mode,level,'overflow')
            assert not errors,errors
            sample.close()
    print('PASS: SNC1W Grade 9 Science 89 word puzzles and all modes, levels, phone width')

    # Ontario CGC1W: real word parts must be authentic and usable in every
    # existing game mode without changing the menu or mobile layout.
    geo,geo_errors=mount(b)
    assert geo.locator('.mode-card').count()==3
    assert geo.locator('#subject option[value="grade9geography"]').inner_text()=='Grade 9 Geography'
    geography=geo.evaluate('''()=>window.MM_DATA.real.filter(r=>r.subject==='grade9geography')''')
    assert len(geography)==76
    assert len(set(q['answer'] for q in geography))==len(geography)
    for word in geography:
        parts=[word['parts'][t] for t in ['prefix','base','suffix'] if word['parts'][t] is not None]
        assert len(parts)>=2,word['answer']
        assert ''.join(parts)==word['answer'],word['answer']
        assert geo.evaluate('''id=>window.MM_DATA.roots.some(r=>r.id===id&&r.subjects.includes('grade9geography'))''',word['parts']['base']),word['answer']
    assert not geo_errors,geo_errors
    geo.close()
    for play_mode in ['wizard','madness','lab']:
        for level,num in [('apprentice',3),('inventor',6),('master',10)]:
            sample,errors=mount(b,width=375 if level=='apprentice' else 1280,height=900)
            if play_mode!='wizard':sample.click('[data-mode="'+play_mode+'"]')
            sample.select_option('#subject','grade9geography')
            sample.select_option('#level',level)
            if play_mode=='lab':sample.emulate_media(reduced_motion='reduce')
            sample.click('#start')
            assert sample.locator('#category-chip').inner_text()=='GRADE 9 GEOGRAPHY'
            if play_mode=='lab':
                sample.click('#spin')
                sample.locator('#definition-area').wait_for(state='visible',timeout=3000)
                value=sample.locator('#reel-base').inner_text()
                assert sample.evaluate('''text=>window.MM_DATA.roots.some(r=>r.text===text && r.subjects.includes('grade9geography'))''',value)
                assert sample.locator('#lab-word').inner_text()!=''
            else:
                record=current_record(sample,'real' if play_mode=='wizard' else 'creative')
                assert record and record['subject']=='grade9geography'
                for part in ['prefix','base','suffix']:
                    assert sample.locator('.bank-column[data-type="'+part+'"] .part-card').count()==num,(play_mode,level,part)
                if play_mode=='wizard':
                    for part in ['prefix','base','suffix']:
                        if record['parts'][part]:select_card(sample,part,record['parts'][part])
                    assert sample.locator('#word-preview').inner_text()==record['answer']
                    sample.click('#check')
                    assert 'You built it' in sample.locator('#feedback').inner_text()
                else:
                    select_card(sample,'base',record['root'])
                    for part,tag in [('prefix',record['prefixTag']),('suffix',record['suffixTag'])]:
                        labels=sample.locator('.bank-column[data-type="'+part+'"] .card-text').all_inner_texts()
                        matches=sample.evaluate('''([part,tag])=>(part==='prefix'?window.MM_DATA.prefixes:window.MM_DATA.suffixes).filter(x=>x.tags.includes(tag)).map(x=>x.text)''',[part,tag])
                        chosen=next((text for text in labels if text in matches),None)
                        assert chosen,(part,tag,labels)
                        select_card(sample,part,chosen.replace('-',''))
                    sample.click('#check')
                    assert 'Strong meaning match' in sample.locator('#feedback').inner_text()
            assert sample.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),(play_mode,level,'horizontal overflow')
            assert not errors,errors
            sample.close()
    print('PASS: 76 Grade 9 Geography words and all three modes at each difficulty')

    # Grade 9 puzzles must remain genuinely buildable with the 3/6/10-card
    # mechanic. Every answer must contain two or three meaningful pieces.
    verify,verify_errors=mount(b)
    grade9=verify.evaluate('''()=>window.MM_DATA.real.filter(r=>r.subject==='grade9math')''')
    assert len(grade9)==70
    for record in grade9:
        parts=[record['parts'][slot] for slot in ['prefix','base','suffix'] if record['parts'][slot]]
        assert len(parts)>=2,(record['answer'],parts)
        assert ''.join(parts)==record['answer'],(record['answer'],parts)
        root=record['parts']['base']
        assert verify.evaluate('''root=>window.MM_DATA.roots.some(r=>r.id===root&&r.subjects.includes('grade9math'))''',root),record['answer']
    assert len(set(record['answer'] for record in grade9))==len(grade9)
    assert not verify_errors,verify_errors
    verify.close()
    print('PASS: Every Grade 9 Word Wizard puzzle assembles correctly from 2+ selectable parts')

    # Readability regression: typography should be comfortable for students
    # and teachers, without horizontal overflow on desktop, tablet or phone.
    for viewport_width in [1280,768,375]:
        sample,errors=mount(b,width=viewport_width,height=900)
        for selector in ['.teacher-guide-intro','.teacher-guide-options p','.mode-description','.help article p','.section-heading p']:
            size=sample.locator(selector).first.evaluate('(node)=>parseFloat(getComputedStyle(node).fontSize)')
            assert size>=16,(viewport_width,selector,size)
        heading=sample.locator('.teacher-guide h2').evaluate('(node)=>parseFloat(getComputedStyle(node).fontSize)')
        assert heading>=21,(viewport_width,'guide heading',heading)
        assert sample.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'),(viewport_width,'setup overflow')
        sample.select_option('#subject','grade9math')
        sample.select_option('#level','master')
        sample.click('#start')
        for selector in ['.clue','.mode-note','.card-meaning','.card-text','.field-hint']:
            if selector=='.field-hint':continue # hidden in Wizard; checked in Lab below
            size=sample.locator(selector).first.evaluate('(node)=>parseFloat(getComputedStyle(node).fontSize)')
            assert size>=16,(viewport_width,selector,size)
        assert sample.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'),(viewport_width,'Wizard overflow')
        assert not errors,errors
        sample.close()
        lab,lab_errors=mount(b,width=viewport_width,height=900)
        lab.click('[data-mode="lab"]')
        lab.select_option('#subject','grade9math')
        lab.emulate_media(reduced_motion='reduce')
        lab.click('#start')
        lab.click('#spin')
        lab.locator('#definition-area').wait_for(state='visible',timeout=3000)
        for selector in ['.reel-text','.reel-meaning','.lab-reveal p','.field-hint']:
            size=lab.locator(selector).first.evaluate('(node)=>parseFloat(getComputedStyle(node).fontSize)')
            assert size>=16,(viewport_width,selector,size)
        assert lab.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'),(viewport_width,'Laboratory overflow')
        assert not lab_errors,lab_errors
        lab.close()
    print('PASS: Readable body text and no horizontal overflow at 1280, 768 and 375px')

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

    # Every difficulty must show 3, 6, or 10 cards in each category,
    # including the intended factual answer or suitable creative meaning tags.
    for mode,kind in [('wizard','real'),('madness','creative')]:
        for level,expected in [('apprentice',3),('inventor',6),('master',10)]:
            sample,errors=mount(b)
            if mode=='madness': sample.click('[data-mode="madness"]')
            assert str(expected) in sample.locator('#level option[value="'+level+'"]').inner_text()
            sample.select_option('#subject','geography')
            sample.select_option('#level',level)
            sample.click('#start')
            record=current_record(sample,kind)
            assert record,(mode,level)
            for type in ['prefix','base','suffix']:
                col=sample.locator('.bank-column[data-type="'+type+'"]')
                assert col.locator('.part-card').count()==expected,(mode,level,type,col.locator('.part-card').count())
                texts=col.locator('.card-text').all_inner_texts()
                assert len(set(texts))==expected,(mode,level,type,'duplicates')
                if mode=='wizard' and record['parts'][type]:
                    part=record['parts'][type]
                    expectedText=(part+'-' if type=='prefix' else '-'+part if type=='suffix' else part)
                    assert expectedText in texts,(mode,level,type,part)
                if mode=='madness':
                    if type=='base':
                        assert record['root'] in texts,(mode,level,type)
                    else:
                        tag=record['prefixTag'] if type=='prefix' else record['suffixTag']
                        matches=sample.evaluate('''([type,tag,labels])=>{
                          const parts=type==='prefix'?window.MM_DATA.prefixes:window.MM_DATA.suffixes;
                          return parts.filter(part=>labels.includes(part.text)&&part.tags.includes(tag)).length;
                        }''',[type,tag,texts])
                        assert matches>0,(mode,level,type,tag)
            assert not errors,errors
            sample.close()
    print('PASS: 3/6/10 cards per category, correct parts and meaning tags')

    # Grade 9 Math must appear alongside Mathematics without adding a new game.
    for play_mode in ['wizard','madness','lab']:
        for level,n in [('apprentice',3),('inventor',6),('master',10)]:
            sample,errors=mount(b)
            assert sample.locator('.mode-card').count()==3
            assert sample.locator('#subject option[value="grade9math"]').inner_text()=='Grade 9 Math'
            if play_mode!='wizard':
                sample.click('[data-mode="'+play_mode+'"]')
            sample.select_option('#subject','grade9math')
            sample.select_option('#level',level)
            if play_mode=='lab':sample.emulate_media(reduced_motion='reduce')
            sample.click('#start')
            assert sample.locator('#category-chip').inner_text()=='GRADE 9 MATH'
            if play_mode=='lab':
                assert sample.locator('#lab-machine').is_visible()
                sample.click('#spin')
                sample.locator('#definition-area').wait_for(state='visible',timeout=3000)
                chosen=sample.locator('#reel-base').inner_text()
                assert sample.evaluate('''text=>window.MM_DATA.roots.some(r=>r.text===text && r.subjects.includes('grade9math'))''',chosen)
                assert sample.locator('#lab-word').inner_text()!=''
                sample.fill('#definition','An invented Grade 9 mathematical idea that combines the meanings of these three word parts.')
                sample.click('#check')
                assert sample.locator('#self-review').is_visible()
                sample.check('#review-one');sample.check('#review-two')
                sample.click('#finish-invention')
                assert 'Invention recorded' in sample.locator('#feedback').inner_text()
            else:
                kind='real' if play_mode=='wizard' else 'creative'
                challenge=current_record(sample,kind)
                assert challenge and challenge['subject']=='grade9math'
                for part in ['prefix','base','suffix']:
                    assert sample.locator('.bank-column[data-type="'+part+'"] .part-card').count()==n
                if play_mode=='wizard':
                    for part in ['prefix','base','suffix']:
                        if challenge['parts'][part]:select_card(sample,part,challenge['parts'][part])
                    assert sample.locator('#word-preview').inner_text()==challenge['answer']
                    sample.click('#check')
                    assert 'You built it' in sample.locator('#feedback').inner_text()
                else:
                    select_card(sample,'base',challenge['root'])
                    for part,tag in [('prefix',challenge['prefixTag']),('suffix',challenge['suffixTag'])]:
                        ids=sample.evaluate('''([part,tag])=>{
                          const arr=part==='prefix'?window.MM_DATA.prefixes:window.MM_DATA.suffixes;
                          return arr.filter(e=>e.tags.includes(tag)).map(e=>e.text);
                        }''',[part,tag])
                        rendered=sample.locator('.bank-column[data-type="'+part+'"] .card-text').all_inner_texts()
                        match=next((label for label in ids if label in rendered),None)
                        assert match,(part,tag,rendered)
                        select_card(sample,part,match.replace('-',''))
                    sample.click('#check')
                    assert 'Strong meaning match' in sample.locator('#feedback').inner_text()
            assert not errors,errors
            sample.close()
    print('PASS: Grade 9 Math selection in all three modes and all levels')

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
    assert page.locator('[data-mode="lab"] .mode-tagline').inner_text()=='Spin and define.'
    assert 'Spin the wheels, watch them stop' in page.locator('[data-mode="lab"] .mode-description').inner_text()
    assert 'Inspired by the work of Tamara Phillips.' in page.locator('footer').inner_text()
    assert 'pre-' in page.locator('.prefix-color').inner_text()
    assert 'often means “before.”' in page.locator('.help-grid article').first.inner_text()
    page.click('[data-mode="lab"]')
    page.click('#start')
    assert page.locator('#clue').inner_text()=='A random word is coming. What could it mean?'
    assert not errors,errors
    print('PASS: Updated Word Laboratory copy, pre- example, and attribution')
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