#!/usr/bin/env node
// Build data/appendix-a.json from the structured source table below.
//
// Source: CDC "Appendix A: Type and Duration of Precautions Recommended for
// Selected Infections and Conditions" (Guideline for Isolation Precautions, 2007),
// web version dated February 2, 2025. Public domain (U.S. Government work).
//
// Precaution codes: S=Standard, C=Contact, D=Droplet, A=Airborne.
// A record with an empty precaution list and `seeAlso` is a cross-reference row
// (the CDC table shows "n/a / n/a / n/a — see X"); kept so search still resolves it.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const P = { S: 'Standard', C: 'Contact', D: 'Droplet', A: 'Airborne' };
const expand = (s) => (s ? s.split(' ').filter(Boolean).map((c) => P[c]) : []);

// r(name, sub, ja, precautionCodes, duration, comments, extra)
// extra: { aliases, durationJa, commentsJa, updated, seeAlso }
const R = [];
const slug = (name, sub) =>
  `${name}${sub ? ' ' + sub : ''}`
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const r = (name, sub, ja, pre, dur, com, extra = {}) => {
  R.push({
    id: slug(name, sub),
    name,
    sub: sub || null,
    nameJa: ja || null,
    aliases: extra.aliases || [],
    precautions: expand(pre),
    duration: dur || 'n/a',
    durationJa: extra.durationJa || null,
    comments: com || null,
    commentsJa: extra.commentsJa || null,
    updated: extra.updated || null,
    seeAlso: extra.seeAlso || null,
  });
};

/* ========================= A ========================= */
r('Abscess', 'Draining, major', '膿瘍（大量排膿）', 'C S', 'Duration of illness',
  'Until drainage stops or can be contained by dressing.',
  { durationJa: '罹病期間', commentsJa: '排膿が止まる、または被覆材で制御できるまで。' });
r('Abscess', 'Draining, minor or limited', '膿瘍（軽微・限局）', 'S', 'n/a',
  'If dressing covers and contains drainage.',
  { commentsJa: '被覆材で排膿を覆い制御できる場合。' });
r('Acquired human immunodeficiency syndrome (HIV)', null, '後天性免疫不全症候群（HIV）', 'S', 'n/a',
  'Postexposure chemoprophylaxis for some blood exposures.',
  { aliases: ['HIV', 'AIDS', 'エイズ', 'えいず'], commentsJa: '一部の血液曝露では曝露後化学予防を行う。' });
r('Actinomycosis', null, '放線菌症', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Adenovirus infection', null, 'アデノウイルス感染症', '', 'n/a', null,
  { seeAlso: 'Gastroenteritis / Conjunctivitis / Pneumonia', aliases: ['アデノ', 'あでの'] });
r('Amebiasis', null, 'アメーバ症', 'S', 'n/a',
  'Person-to-person transmission is rare. Use care when handling diapered infants and mentally challenged persons.',
  { commentsJa: 'ヒト-ヒト感染はまれ。おむつ使用乳児等の取り扱いに注意。' });
r('Andes virus', null, 'アンデスウイルス', '', 'See comments',
  'Patient Placement: AIIR. PPE: Gown, gloves, eye protection, N95® respirator or higher. Duration determined case-by-case with local/state/federal health authorities.',
  { updated: '2024-09', durationJa: '個別判断',
    commentsJa: '陰圧個室(AIIR)。ガウン・手袋・眼保護・N95以上。期間は保健当局と個別協議。' });
r('Anthrax', null, '炭疽', 'S', 'n/a', 'Infected patients do not generally pose a transmission risk.',
  { aliases: ['たんそ'], commentsJa: '通常は感染伝播リスクなし。' });
r('Anthrax', 'Cutaneous', '炭疽（皮膚）', 'S', 'n/a',
  'Use Contact Precautions if large amount of uncontained drainage. Handwashing with soap and water preferable — alcohol has no sporicidal activity.',
  { commentsJa: '大量の制御不能な排膿があれば接触予防。芽胞に無効なため石けんと流水で手洗い。' });
r('Anthrax', 'Pulmonary', '炭疽（肺）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Anthrax', 'Environmental (aerosolizable spores)', '炭疽（環境／エアロゾル化芽胞）', '', 'Until environment decontaminated',
  'Wear respirator (N95 or PAPR) and protective clothing; decontaminate persons with powder on them. Handwashing 30-60s with soap and water or 2% chlorhexidine (alcohol inactive against spores). Postexposure prophylaxis 60 days of antimicrobials + vaccine under IND.',
  { durationJa: '環境の除染完了まで',
    commentsJa: 'N95/PAPR＋防護衣。粉末が付着した人を除染。石けん流水30-60秒。曝露後予防60日＋ワクチン。' });
r('Arthropod-borne viral encephalitides and fevers', null, '節足動物媒介ウイルス脳炎・熱', 'S', 'n/a',
  'Includes eastern/western/Venezuelan equine encephalomyelitis, St Louis, California encephalitis, West Nile; dengue, Oropouche, yellow fever, Colorado tick fever. Install screens; use DEET repellents and cover extremities.',
  { commentsJa: '各種ウイルス脳炎・熱。窓戸に網戸、DEET忌避剤、露出防止。' });
r('Ascariasis', null, '回虫症', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Aspergillosis', null, 'アスペルギルス症', 'S', 'n/a',
  'Contact Precautions and Airborne if massive soft tissue infection with copious drainage and repeated irrigations required.',
  { commentsJa: '大量排膿を伴う広範な軟部組織感染で反復洗浄が必要なら接触＋空気予防。' });
r('Avian influenza', null, '鳥インフルエンザ', '', 'n/a', null,
  { seeAlso: 'Influenza, Avian', aliases: ['H5N1', 'とりインフル'] });

/* ========================= B ========================= */
r('Babesiosis', null, 'バベシア症', 'S', 'n/a',
  'Not transmitted from person to person, except rarely by transfusion.',
  { commentsJa: '輸血によるまれな例外を除きヒト-ヒト感染しない。' });
r('Blastomycosis, North American', null, 'ブラストミセス症（北米）', 'S', 'n/a',
  'Cutaneous or pulmonary. Not transmitted from person to person.',
  { commentsJa: '皮膚・肺。ヒト-ヒト感染しない。' });
r('Botulism', null, 'ボツリヌス症', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Bronchiolitis', null, '細気管支炎', 'C S', 'Duration of illness',
  'See Respiratory Infections in infants and young children. Use mask according to Standard Precautions.',
  { durationJa: '罹病期間', commentsJa: '乳幼児の呼吸器感染参照。標準予防に従いマスク。' });
r('Brucellosis', null, 'ブルセラ症（波状熱・マルタ熱）', 'S', 'n/a',
  'Not transmitted from person to person, except rarely via banked spermatozoa and sexual contact. Provide antimicrobial prophylaxis following laboratory exposure.',
  { commentsJa: 'まれな例外を除きヒト-ヒト感染しない。検査室曝露では抗菌薬予防。' });

/* ========================= C ========================= */
r('Campylobacter gastroenteritis', null, 'カンピロバクター腸炎', '', 'n/a', null,
  { seeAlso: 'Gastroenteritis' });
r('Candidiasis', null, 'カンジダ症', 'S', 'n/a', 'All forms including mucocutaneous.',
  { commentsJa: '粘膜皮膚型を含む全型。' });
r('Cat-scratch fever', null, '猫ひっかき病', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Cellulitis', null, '蜂窩織炎', 'S', 'n/a', null);
r('Chancroid', null, '軟性下疳', 'S', 'n/a', 'Transmitted sexually from person to person.',
  { commentsJa: '性行為感染。' });
r('Chickenpox', null, '水痘', '', 'n/a', null, { seeAlso: 'Varicella', aliases: ['みずぼうそう', 'varicella'] });
r('Chlamydia trachomatis', 'Conjunctivitis', 'クラミジア結膜炎', 'S', 'n/a', null);
r('Chlamydia trachomatis', 'Genital (lymphogranuloma venereum)', 'クラミジア性器感染（鼠径リンパ肉芽腫）', 'S', 'n/a', null);
r('Chlamydia trachomatis', 'Pneumonia (infants ≤3 mos.)', 'クラミジア肺炎（生後3か月以下）', 'S', 'n/a', null);
r('Chlamydia pneumoniae', null, '肺炎クラミジア', 'S', 'n/a',
  'Outbreaks in institutionalized populations reported, rarely.',
  { commentsJa: '施設集団でのアウトブレイク報告あり（まれ）。' });
r('Cholera', null, 'コレラ', '', 'n/a', null, { seeAlso: 'Gastroenteritis' });
r('Closed-cavity infection', 'Open drain / limited drainage', '閉鎖腔感染（開放ドレーン・軽度）', 'S', 'n/a',
  'Contact Precautions if there is copious uncontained drainage.',
  { commentsJa: '大量で制御不能な排膿があれば接触予防。' });
r('Closed-cavity infection', 'No drain / closed system', '閉鎖腔感染（ドレーンなし・閉鎖式）', 'S', 'n/a', null);
r('Clostridium botulinum', null, 'ボツリヌス菌', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Clostridium difficile', null, 'クロストリジオイデス・ディフィシル', 'C S', 'Duration of illness',
  'See Gastroenteritis, C. difficile. Handwashing with soap and water; do not share electronic thermometers; hypochlorite for environmental cleaning if transmission continues.',
  { aliases: ['C. diff', 'CD', 'CDI', 'ディフィシル'], updated: '2023-06', durationJa: '罹病期間',
    commentsJa: 'アルコール無効のため石けんと流水。電子体温計の共用禁止。伝播継続時は次亜塩素酸で環境清掃。' });
r('Clostridium perfringens', 'Food poisoning', 'ウェルシュ菌食中毒', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Clostridium perfringens', 'Gas gangrene', 'ウェルシュ菌ガス壊疽', 'S', 'n/a',
  'Person-to-person transmission rare. Use Contact Precautions if wound drainage is extensive.',
  { commentsJa: 'ヒト-ヒト感染はまれ。創部排膿が広範なら接触予防。' });
r('Coccidioidomycosis', 'Draining lesions', 'コクシジオイデス症（排膿病変）', 'S', 'n/a',
  'Not transmitted person to person except under extraordinary circumstances.',
  { commentsJa: '例外的状況を除きヒト-ヒト感染しない。' });
r('Coccidioidomycosis', 'Pneumonia', 'コクシジオイデス症（肺炎）', 'S', 'n/a',
  'Not transmitted person to person except under extraordinary circumstances.',
  { commentsJa: '例外的状況を除きヒト-ヒト感染しない。' });
r('Colorado tick fever', null, 'コロラドダニ熱', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Congenital rubella', null, '先天性風疹', 'C S', 'Until 1 yr of age',
  'Standard Precautions if nasopharyngeal and urine cultures repeatedly negative after 3 mos. of age.',
  { durationJa: '生後1歳まで', commentsJa: '生後3か月以降に咽頭・尿培養が反復陰性なら標準予防。' });
r('Conjunctivitis', 'Acute bacterial', '急性細菌性結膜炎', 'S', 'n/a', null);
r('Conjunctivitis', 'Acute viral (acute hemorrhagic)', '急性ウイルス性（急性出血性）結膜炎', 'C S', 'Duration of illness',
  'Adenovirus most common; enterovirus 70, Coxsackie A24 also. Highly contagious; outbreaks in eye clinics and neonatal settings reported.',
  { durationJa: '罹病期間', commentsJa: 'アデノが最多。極めて伝染性が高く眼科・新生児施設で流行報告。' });
r('Creutzfeldt-Jakob disease', null, 'クロイツフェルト・ヤコブ病', 'S', 'n/a',
  'CJD, vCJD. Use disposable instruments or special sterilization/disinfection for surfaces contaminated with neural tissue. No special burial procedures.',
  { aliases: ['CJD', 'vCJD', 'ヤコブ病', 'プリオン'], commentsJa: '神経組織汚染には使い捨て器具か特別滅菌。特別な埋葬手順は不要。' });
r('Cryptococcosis', null, 'クリプトコッカス症', 'S', 'n/a',
  'Not transmitted person to person except rarely via tissue and corneal transplant.',
  { commentsJa: '組織・角膜移植によるまれな例外を除きヒト-ヒト感染しない。' });
r('Cryptosporidiosis', null, 'クリプトスポリジウム症', '', 'n/a', null, { seeAlso: 'Gastroenteritis' });
r('Cysticercosis', null, '嚢虫症', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Cytomegalovirus infection', null, 'サイトメガロウイルス感染症', 'S', 'n/a',
  'Including neonates and immunosuppressed. No additional precautions for pregnant HCWs.',
  { aliases: ['CMV', 'サイトメガロ'], commentsJa: '新生児・免疫抑制者を含む。妊娠中の医療者に追加予防は不要。' });

/* ========================= D ========================= */
r('Decubitus ulcer', null, '褥瘡', '', 'n/a', null, { seeAlso: 'Pressure Ulcer', aliases: ['じょくそう'] });
r('Dengue fever', null, 'デング熱', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Diphtheria', 'Cutaneous', 'ジフテリア（皮膚）', 'C S', 'Until off antimicrobials and culture-negative',
  'Until 2 cultures taken 24 hours apart negative.',
  { durationJa: '抗菌薬終了かつ培養陰性まで', commentsJa: '24時間あけた2回の培養が陰性になるまで。' });
r('Diphtheria', 'Pharyngeal', 'ジフテリア（咽頭）', 'D S', 'Until off antimicrobials and culture-negative',
  'Until 2 cultures taken 24 hours apart negative.',
  { durationJa: '抗菌薬終了かつ培養陰性まで', commentsJa: '24時間あけた2回の培養が陰性になるまで。' });

/* ========================= E ========================= */
r('Ebola virus', null, 'エボラウイルス', '', 'n/a', null, { seeAlso: 'Viral Hemorrhagic Fevers', aliases: ['エボラ'] });
r('Echinococcosis', null, 'エキノコックス症（包虫症）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Endometritis (endomyometritis)', null, '子宮内膜炎', 'S', 'n/a', null);
r('Enterobiasis (pinworm)', null, '蟯虫症', 'S', 'n/a', null, { aliases: ['pinworm', 'ぎょうちゅう'] });
r('Enteroviral infections', null, 'エンテロウイルス感染症', 'S', 'n/a',
  'Group A/B Coxsackie and Echoviruses (excludes polio). Use Contact Precautions for diapered or incontinent children for duration of illness and to control outbreaks.',
  { aliases: ['コクサッキー', 'エコー'], commentsJa: 'おむつ使用・失禁の小児では罹病期間中および流行制御に接触予防。' });
r('Epiglottitis (Haemophilus influenzae type b)', null, '喉頭蓋炎（Hib）', 'D S', 'Until 24h after effective therapy',
  'See specific disease agents for epiglottitis due to other etiologies.',
  { aliases: ['Hib', 'こうとうがいえん'], durationJa: '有効治療開始後24時間まで' });
r('Epstein-Barr virus infection', null, 'EBウイルス感染症（伝染性単核症）', 'S', 'n/a', 'Including infectious mononucleosis.',
  { aliases: ['EBV', 'EBウイルス', '単核症'] });
r('Erythema infectiosum', null, '伝染性紅斑（リンゴ病）', '', 'n/a', null,
  { seeAlso: 'Parvovirus B19', aliases: ['りんご病', 'リンゴ病'] });
r('Escherichia coli gastroenteritis', null, '大腸菌腸炎', '', 'n/a', null, { seeAlso: 'Gastroenteritis' });

/* ========================= F ========================= */
r('Food poisoning', 'Botulism', '食中毒（ボツリヌス）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Food poisoning', 'C. perfringens or welchii', '食中毒（ウェルシュ菌）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Food poisoning', 'Staphylococcal', '食中毒（ブドウ球菌）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Furunculosis, staphylococcal', null, 'ブドウ球菌性癤（せつ）症', 'S', 'n/a',
  'Contact if drainage not controlled. Follow institutional policies if MRSA.',
  { aliases: ['MRSA', 'せつ'], commentsJa: '排膿が制御できなければ接触予防。MRSAは施設方針に従う。' });
r('Furunculosis, staphylococcal', 'Infants and young children', 'ブドウ球菌性癤症（乳幼児）', 'C S',
  'Duration of illness', 'With wound lesions, until wounds stop draining.',
  { durationJa: '罹病期間', commentsJa: '創病変がある場合、排膿が止まるまで。' });

/* ========================= G ========================= */
r('Gangrene (gas gangrene)', null, '壊疽（ガス壊疽）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Gastroenteritis', null, '胃腸炎（総論）', 'S', 'n/a',
  'Use Contact Precautions for diapered or incontinent persons for the duration of illness or to control institutional outbreaks (applies to the agents below).',
  { aliases: ['gastro', 'いちょうえん', '腸炎'],
    commentsJa: 'おむつ使用・失禁者では罹病期間中および流行制御に接触予防（下記各病原体に適用）。' });
r('Gastroenteritis', 'Adenovirus', '胃腸炎（アデノウイルス）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'Campylobacter species', '胃腸炎（カンピロバクター）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'Cholera (Vibrio cholerae)', '胃腸炎（コレラ）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'C. difficile', '胃腸炎（C. difficile）', 'C S', 'Duration of illness',
  'Discontinue antibiotics if appropriate. Do not share electronic thermometers; ensure environmental cleaning; hypochlorite may be required if transmission continues. Handwashing with soap and water preferred (alcohol not sporicidal).',
  { aliases: ['C. diff', 'CDI', 'ディフィシル'], updated: '2023-06', durationJa: '罹病期間',
    commentsJa: '可能なら抗菌薬中止。電子体温計を共用しない。環境清掃徹底、伝播継続時は次亜塩素酸。石けんと流水で手洗い（アルコールは芽胞に無効）。' });
r('Gastroenteritis', 'Cryptosporidium species', '胃腸炎（クリプトスポリジウム）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'E. coli O157:H7 and Shiga toxin-producing', '胃腸炎（腸管出血性大腸菌O157等）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { aliases: ['O157', 'EHEC'], commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'E. coli, other species', '胃腸炎（その他の大腸菌）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'Giardia lamblia', '胃腸炎（ジアルジア）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'Noroviruses', '胃腸炎（ノロウイルス）', 'C S', 'Min. 48h after resolution of symptoms',
  'Contact Precautions for a minimum of 48 hours after resolution of symptoms or to control outbreaks. Masks for those cleaning heavily contaminated areas (virus can aerosolize). Hypochlorite may be required; alcohol less active. Type of Precaution updated Standard → Contact + Standard.',
  { aliases: ['noro', 'ノロ', 'norovirus'], updated: '2019-04', durationJa: '症状消失後最低48時間',
    commentsJa: '症状消失後最低48時間は接触予防。糞便・吐物はエアロゾル化しうるためマスク。次亜塩素酸推奨、アルコールは効果が弱い。2019年に標準→接触＋標準へ改訂。' });
r('Gastroenteritis', 'Rotavirus', '胃腸炎（ロタウイルス）', 'C S', 'Duration of illness',
  'Ensure environmental cleaning and frequent removal of soiled diapers. Prolonged shedding may occur in both immunocompetent and immunocompromised children and the elderly.',
  { aliases: ['rota', 'ロタ'], durationJa: '罹病期間',
    commentsJa: '環境清掃と汚染おむつの頻回交換。小児・高齢者では排出が遷延しうる。' });
r('Gastroenteritis', 'Salmonella species (incl. S. typhi)', '胃腸炎（サルモネラ／腸チフス）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'Shigella species (bacillary dysentery)', '胃腸炎（赤痢菌）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { aliases: ['せきり'], commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'Vibrio parahaemolyticus', '胃腸炎（腸炎ビブリオ）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'Viral (if not covered elsewhere)', '胃腸炎（ウイルス性・他項目外）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('Gastroenteritis', 'Yersinia enterocolitica', '胃腸炎（エルシニア）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent persons for duration of illness or to control outbreaks.',
  { commentsJa: 'おむつ・失禁者では罹病期間中に接触予防。' });
r('German measles', null, '風疹（ドイツ麻疹）', '', 'n/a', null,
  { seeAlso: 'Rubella / Congenital Rubella', aliases: ['ふうしん', 'rubella'] });
r('Giardiasis', null, 'ジアルジア症', '', 'n/a', null, { seeAlso: 'Gastroenteritis' });
r('Gonococcal ophthalmia neonatorum', null, '新生児淋菌性眼炎', 'S', 'n/a', null);
r('Gonorrhea', null, '淋病', 'S', 'n/a', null, { aliases: ['りんびょう'] });
r('Granuloma inguinale (Donovanosis)', null, '鼠径肉芽腫', 'S', 'n/a', null);
r('Guillain-Barré syndrome', null, 'ギラン・バレー症候群', 'S', 'n/a', 'Not an infectious condition.',
  { aliases: ['GBS', 'ギランバレー'], commentsJa: '感染症ではない。' });

/* ========================= H ========================= */
r('Hantavirus pulmonary syndrome', null, 'ハンタウイルス肺症候群', 'S', 'n/a', 'Not transmitted from person to person.',
  { aliases: ['ハンタ'], commentsJa: 'ヒト-ヒト感染しない。' });
r('Helicobacter pylori', null, 'ヘリコバクター・ピロリ', 'S', 'n/a', null, { aliases: ['ピロリ', 'H. pylori'] });
r('Hepatitis, viral', 'Type A', 'ウイルス性肝炎（A型）', 'S', 'n/a', 'Provide hepatitis A vaccine postexposure as recommended.',
  { aliases: ['HAV', 'A型肝炎'], commentsJa: '推奨に従い曝露後にA型肝炎ワクチン。' });
r('Hepatitis, viral', 'Type A — diapered/incontinent', 'ウイルス性肝炎（A型・おむつ／失禁）', 'C S', 'See comments',
  'Contact Precautions: infants/children <3y for duration of hospitalization; 3-14y for 2 weeks after onset; >14y for 1 week after onset.',
  { durationJa: '年齢により異なる', commentsJa: '3歳未満は入院中、3-14歳は発症後2週、14歳超は発症後1週。' });
r('Hepatitis, viral', 'Type B — HBsAg positive', 'ウイルス性肝炎（B型・HBsAg陽性）', 'S', 'n/a',
  'Acute or chronic. See specific recommendations for hemodialysis centers.',
  { aliases: ['HBV', 'B型肝炎', 'HBsAg'], commentsJa: '急性・慢性。血液透析施設は個別推奨参照。' });
r('Hepatitis, viral', 'Type C and non-A non-B', 'ウイルス性肝炎（C型ほか）', 'S', 'n/a',
  'See specific recommendations for hemodialysis centers.',
  { aliases: ['HCV', 'C型肝炎'], commentsJa: '血液透析施設は個別推奨参照。' });
r('Hepatitis, viral', 'Type D', 'ウイルス性肝炎（D型）', 'S', 'n/a', 'Seen only with hepatitis B.',
  { aliases: ['HDV', 'D型肝炎'], commentsJa: 'B型肝炎に併発する場合のみ。' });
r('Hepatitis, viral', 'Type E', 'ウイルス性肝炎（E型）', 'S', 'n/a',
  'Contact Precautions for diapered/incontinent individuals for duration of illness.',
  { aliases: ['HEV', 'E型肝炎'], commentsJa: 'おむつ・失禁者は罹病期間中に接触予防。' });
r('Hepatitis, viral', 'Type G', 'ウイルス性肝炎（G型）', 'S', 'n/a', null, { aliases: ['HGV'] });
r('Herpes simplex', 'Encephalitis', '単純ヘルペス（脳炎）', 'S', 'n/a', null, { aliases: ['HSV', 'ヘルペス'] });
r('Herpes simplex', 'Mucocutaneous, disseminated or primary, severe', '単純ヘルペス（粘膜皮膚・播種／重症初発）', 'C S',
  'Until lesions dry and crusted', null,
  { aliases: ['HSV'], durationJa: '病変が乾燥・被殻化するまで' });
r('Herpes simplex', 'Mucocutaneous, recurrent', '単純ヘルペス（粘膜皮膚・再発）', 'S', 'n/a', 'Skin, oral, genital.',
  { aliases: ['HSV'] });
r('Herpes simplex', 'Neonatal', '単純ヘルペス（新生児）', 'C S', 'Until lesions dry and crusted',
  'Also for asymptomatic exposed infants delivered vaginally/C-section if mother has active infection and membranes ruptured >4-6h, until surface cultures at 24-36h are negative after 48h incubation.',
  { durationJa: '病変が乾燥・被殻化するまで' });
r('Herpes zoster (shingles)', 'Disseminated, or localized in immunocompromised', '帯状疱疹（播種性／免疫不全の局所）', 'A C S',
  'Duration of illness',
  'Susceptible HCWs should not enter room if immune caregivers available; localized disease in immunocompromised until disseminated infection ruled out.',
  { aliases: ['shingles', '帯状疱疹', 'たいじょうほうしん'], durationJa: '罹病期間',
    commentsJa: '免疫のある医療者がいれば感受性者は入室しない。免疫不全の局所例は播種を除外するまで。' });
r('Herpes zoster (shingles)', 'Localized, intact immune system', '帯状疱疹（局所・免疫正常）', 'S', 'Until lesions dry and crusted',
  'Susceptible HCWs should not provide direct care when other immune caregivers are available; lesions can be contained/covered.',
  { durationJa: '病変が乾燥・被殻化するまで', commentsJa: '病変を覆える場合。感受性の医療者は免疫のある者がいれば直接ケアを避ける。' });
r('Histoplasmosis', null, 'ヒストプラズマ症', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Human immunodeficiency virus (HIV)', null, 'ヒト免疫不全ウイルス（HIV）', 'S', 'n/a',
  'Postexposure chemoprophylaxis for some blood exposures.',
  { aliases: ['HIV', 'AIDS', 'エイズ'], commentsJa: '一部の血液曝露で曝露後化学予防。' });
r('Human metapneumovirus', null, 'ヒトメタニューモウイルス', 'C S', 'Duration of illness',
  'Assumed Contact transmission as for RSV. Wear masks per Standard Precautions.',
  { aliases: ['hMPV', 'メタニューモ'], durationJa: '罹病期間',
    commentsJa: 'RSV同様に接触感染と想定。標準予防に従いマスク。' });

/* ========================= I ========================= */
r('Impetigo', null, '伝染性膿痂疹（とびひ）', 'C S', 'Until 24h after effective therapy',
  null, { aliases: ['とびひ', 'のうかしん'], durationJa: '有効治療開始後24時間まで' });
r('Infectious mononucleosis', null, '伝染性単核症', 'S', 'n/a', null, { aliases: ['単核症'] });
r('Influenza', 'Human (seasonal)', 'インフルエンザ（季節性）', 'S', 'n/a',
  'See current CDC Prevention Strategies for Seasonal Influenza in Healthcare Settings.',
  { aliases: ['flu', 'インフル'], commentsJa: '最新のCDC季節性インフルエンザ院内対策を参照。' });
r('Influenza', 'Avian (H5N1, H7, H9)', 'インフルエンザ（鳥・H5N1等）', '', 'n/a',
  'See current CDC interim guidance for novel influenza A viruses associated with severe disease.',
  { aliases: ['H5N1', '鳥インフル'], commentsJa: '重症化する新型インフルA暫定指針を参照。' });
r('Influenza', 'Pandemic', 'インフルエンザ（パンデミック）', 'D S', 'n/a',
  'Also a human influenza virus. See current CDC interim guidance.',
  { commentsJa: '最新のCDC暫定指針を参照。' });

/* ========================= K ========================= */
r('Kawasaki syndrome', null, '川崎病', 'S', 'n/a', 'Not an infectious condition.',
  { aliases: ['かわさきびょう'], commentsJa: '感染症ではない。' });

/* ========================= L ========================= */
r('Lassa fever', null, 'ラッサ熱', '', 'n/a', null, { seeAlso: 'Viral Hemorrhagic Fevers' });
r('Legionnaires’ disease', null, 'レジオネラ症', 'S', 'n/a', 'Not transmitted from person to person.',
  { aliases: ['legionella', 'レジオネラ'], commentsJa: 'ヒト-ヒト感染しない。' });
r('Leprosy', null, 'ハンセン病（らい）', 'S', 'n/a', null, { aliases: ['ハンセン病', 'Hansen'] });
r('Leptospirosis', null, 'レプトスピラ症', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Lice', 'Head (pediculosis)', 'アタマジラミ症', 'C S', 'Until 24h after effective therapy',
  null, { aliases: ['pediculosis', 'しらみ', 'アタマジラミ'], durationJa: '有効治療開始後24時間まで' });
r('Lice', 'Body', 'コロモジラミ症', 'S', 'n/a',
  'Transmitted person-to-person through infested clothing. Wear gown and gloves when removing clothing.',
  { commentsJa: '汚染衣類を介して感染。脱衣時はガウン・手袋。' });
r('Lice', 'Pubic', 'ケジラミ症', 'S', 'n/a', 'Transmitted through sexual contact.',
  { commentsJa: '性的接触で感染。' });
r('Listeriosis', null, 'リステリア症', 'S', 'n/a',
  'Person-to-person transmission rare; cross-transmission in neonatal settings reported.',
  { aliases: ['リステリア'], commentsJa: 'ヒト-ヒト感染はまれ。新生児施設での交差感染報告あり。' });
r('Lyme disease', null, 'ライム病', 'S', 'n/a', 'Not transmitted from person to person.',
  { aliases: ['ライム'], commentsJa: 'ヒト-ヒト感染しない。' });
r('Lymphocytic choriomeningitis', null, 'リンパ球性脈絡髄膜炎', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Lymphogranuloma venereum', null, '鼠径リンパ肉芽腫', 'S', 'n/a', null, { aliases: ['LGV'] });

/* ========================= M ========================= */
r('Malaria', null, 'マラリア', 'S', 'n/a',
  'Not transmitted person to person except through transfusion rarely and failure to follow Standard Precautions. Install screens; use DEET repellents.',
  { aliases: ['まらりあ'], commentsJa: '輸血等のまれな例外を除きヒト-ヒト感染しない。網戸・DEET忌避剤。' });
r('Marburg virus disease', null, 'マールブルグ病', '', 'n/a', null, { seeAlso: 'Viral Hemorrhagic Fevers' });
r('Measles (rubeola)', null, '麻疹（はしか）', 'A S', '4 days after onset of rash (duration of illness if immunocompromised)',
  'Susceptible HCP should not enter room if immune providers available; regardless of presumptive immunity, HCP should use at least a fit-tested N95 respirator on entry. Postexposure vaccine within 72h or immune globulin within 6 days. Place exposed susceptibles on Airborne Precautions.',
  { aliases: ['measles', 'はしか', 'ましん', 'rubeola'], updated: '2019-07',
    durationJa: '発疹出現後4日（免疫抑制者は罹病期間）',
    commentsJa: '免疫のある医療者がいれば感受性者は入室しない。免疫の推定有無に関わらず入室時にN95以上を着用。曝露後72時間以内にワクチン、6日以内に免疫グロブリン。' });
r('Melioidosis', null, '類鼻疽（メリオイドーシス）', 'S', 'n/a', 'All forms. Not transmitted from person to person.',
  { commentsJa: '全型。ヒト-ヒト感染しない。' });
r('Meningitis', 'Aseptic (nonbacterial/viral)', '髄膜炎（無菌性・ウイルス性）', 'S', 'n/a',
  'Contact for infants and young children. See Enteroviral infections.',
  { aliases: ['ずいまくえん'], commentsJa: '乳幼児は接触予防。' });
r('Meningitis', 'Bacterial, gram-negative enteric (neonates)', '髄膜炎（グラム陰性腸内細菌・新生児）', 'S', 'n/a', null);
r('Meningitis', 'Fungal', '髄膜炎（真菌性）', 'S', 'n/a', null);
r('Meningitis', 'Haemophilus influenzae type b', '髄膜炎（Hib）', 'D S', 'Until 24h after effective therapy',
  null, { aliases: ['Hib'], durationJa: '有効治療開始後24時間まで' });
r('Meningitis', 'Neisseria meningitidis (meningococcal)', '髄膜炎（髄膜炎菌）', 'D S', 'Until 24h after effective therapy',
  'See Meningococcal Disease.', { aliases: ['髄膜炎菌', 'meningococcal'], durationJa: '有効治療開始後24時間まで' });
r('Meningitis', 'Streptococcus pneumoniae', '髄膜炎（肺炎球菌）', 'S', 'n/a', null);
r('Meningitis', 'M. tuberculosis', '髄膜炎（結核）', 'S', 'n/a',
  'Concurrent active pulmonary disease or draining lesions may necessitate Contact and/or Airborne. For children, Airborne until active TB ruled out in visiting family.',
  { commentsJa: '活動性肺結核や排膿病変の併発時は接触・空気予防を追加。小児は面会家族の活動性結核を除外するまで空気予防。' });
r('Meningococcal disease', null, '髄膜炎菌感染症', 'D S', 'Until 24h after effective therapy',
  'Sepsis, pneumonia, meningitis. Postexposure chemoprophylaxis for household contacts and HCWs exposed to respiratory secretions; postexposure vaccine only to control outbreaks.',
  { aliases: ['meningococcal', '髄膜炎菌'], durationJa: '有効治療開始後24時間まで',
    commentsJa: '敗血症・肺炎・髄膜炎。同居者や気道分泌物に曝露した医療者へ曝露後化学予防。' });
r('Molluscum contagiosum', null, '伝染性軟属腫（水いぼ）', 'S', 'n/a', null, { aliases: ['水いぼ', 'みずいぼ'] });
r('Monkeypox', null, 'サル痘（Mpox）', 'S', 'See comments', 'See CDC Monkeypox website for infection prevention and control.',
  { aliases: ['mpox', 'サル痘'], commentsJa: 'CDCのMpoxサイトを参照。' });
r('Mucormycosis', null, 'ムコール症', 'S', 'n/a', null);
r('Multidrug-resistant organisms (MDROs)', null, '多剤耐性菌（MDRO）', 'C S', 'See comments',
  'MRSA, VRE, VISA/VRSA, ESBLs, resistant S. pneumoniae. Contact Precautions in settings with ongoing transmission, increased risk, or wounds not contained by dressings. Contact state health department for new/emerging MDRO.',
  { aliases: ['MDRO', 'MRSA', 'VRE', 'ESBL', '耐性菌', 'たいせいきん'], durationJa: '個別判断',
    commentsJa: '伝播継続・高リスク環境・被覆材で覆えない創部では接触予防。新規MDROは保健当局に相談。' });
r('Mumps (infectious parotitis)', null, '流行性耳下腺炎（おたふくかぜ）', 'D S', 'Until 5 days after onset of swelling',
  'Isolation changed from 9 days to 5 days after onset of parotid swelling (HICPAC, 2017). Susceptible HCWs should not provide care if immune caregivers available.',
  { aliases: ['mumps', 'おたふく', 'ムンプス', 'じかせんえん'], updated: '2017-10',
    durationJa: '耳下腺腫脹後5日まで',
    commentsJa: '隔離は腫脹発症後9日→5日に変更（2017年）。免疫のある医療者がいれば感受性者はケアしない。' });
r('Mycobacteria, nontuberculosis (atypical)', null, '非結核性抗酸菌症', 'S', 'n/a',
  'Pulmonary and wound forms Standard. Not transmitted person-to-person.',
  { aliases: ['NTM', '非結核性抗酸菌'], commentsJa: '肺・創ともに標準予防。ヒト-ヒト感染しない。' });
r('Mycoplasma pneumonia', null, 'マイコプラズマ肺炎', 'D S', 'Duration of illness', null,
  { aliases: ['マイコプラズマ'], durationJa: '罹病期間' });

/* ========================= N ========================= */
r('Necrotizing enterocolitis', null, '壊死性腸炎', 'S', 'n/a', 'Contact Precautions when cases clustered temporally.',
  { aliases: ['NEC'], commentsJa: '時間的に集積する場合は接触予防。' });
r('Nipah virus', null, 'ニパウイルス', '', 'See comments',
  'Patient Placement: AIIR. If suspect and clinically stable: gown, gloves, eye protection, N95® or higher. If suspect and unstable OR confirmed: use PPE per VHF guidance. Duration case-by-case with health authorities.',
  { aliases: ['ニパ'], updated: '2024-09', durationJa: '個別判断',
    commentsJa: '陰圧個室(AIIR)。疑い＋安定：ガウン・手袋・眼保護・N95以上。疑い＋不安定または確定：VHFに準じたPPE。' });
r('Nocardiosis', null, 'ノカルジア症', 'S', 'n/a', 'Draining lesions or other presentations. Not transmitted person-to-person.',
  { commentsJa: '排膿病変その他。ヒト-ヒト感染しない。' });
r('Norovirus', null, 'ノロウイルス', '', 'n/a', null, { seeAlso: 'Gastroenteritis, Noroviruses', aliases: ['ノロ', 'noro'] });

/* ========================= O ========================= */
r('Orf', null, 'オルフ（伝染性膿疱性皮膚炎）', 'S', 'n/a', null);

/* ========================= P ========================= */
r('Parainfluenza virus infection', null, 'パラインフルエンザ感染症', 'C S', 'Duration of illness',
  'Respiratory in infants and young children. Viral shedding may be prolonged in immunosuppressed patients; reliability of antigen testing to guide removal from Contact Precautions uncertain.',
  { aliases: ['パラインフル'], durationJa: '罹病期間',
    commentsJa: '免疫抑制者では排出が遷延しうる。抗原検査での解除判断は信頼性不確実。' });
r('Parvovirus B19', null, 'パルボウイルスB19（リンゴ病）', 'D S', 'See comments',
  'Maintain precautions for duration of hospitalization when chronic disease occurs in immunocompromised. For transient aplastic/red-cell crisis, maintain 7 days.',
  { aliases: ['りんご病', 'erythema infectiosum'], durationJa: '状況により異なる',
    commentsJa: '免疫不全の慢性例は入院中維持。一過性赤芽球癆・無形成発作は7日間維持。' });
r('Pediculosis (lice)', null, 'シラミ症（頭ジラミ）', 'C S', 'Until 24h after effective therapy',
  null, { aliases: ['しらみ', 'lice'], durationJa: '有効治療開始後24時間まで' });
r('Pertussis (whooping cough)', null, '百日咳', 'D S', 'Until 5 days after effective antibiotics',
  'Single patient room preferred; cohorting an option. Postexposure chemoprophylaxis for household contacts and HCWs with prolonged exposure to respiratory secretions.',
  { aliases: ['pertussis', 'ひゃくにちぜき', '百日咳', 'whooping'],
    durationJa: '有効な抗菌薬開始後5日まで',
    commentsJa: '個室が望ましい。同居者や長時間気道分泌物に曝露した医療者へ曝露後化学予防。' });
r('Pinworm infection (Enterobiasis)', null, '蟯虫症', 'S', 'n/a', null, { aliases: ['ぎょうちゅう', 'pinworm'] });
r('Plague (Yersinia pestis)', 'Bubonic', 'ペスト（腺ペスト）', 'S', 'n/a', null, { aliases: ['ペスト', 'plague'] });
r('Plague (Yersinia pestis)', 'Pneumonic', 'ペスト（肺ペスト）', 'D S', 'Until 48h after effective antibiotics',
  'Antimicrobial prophylaxis for exposed HCW.',
  { aliases: ['肺ペスト'], durationJa: '有効な抗菌薬開始後48時間まで', commentsJa: '曝露した医療者に抗菌薬予防。' });
r('Pneumonia', 'Adenovirus', '肺炎（アデノウイルス）', 'D C S', 'Duration of illness',
  'Outbreaks in pediatric and institutional settings reported. In immunocompromised hosts, extend Droplet and Contact due to prolonged shedding.',
  { durationJa: '罹病期間', commentsJa: '免疫不全者では排出遷延のため飛沫・接触予防を延長。' });
r('Pneumonia', 'Bacterial not listed elsewhere', '肺炎（他項目外の細菌性）', 'S', 'n/a', 'Including gram-negative bacterial.',
  {});
r('Pneumonia', 'B. cepacia (cystic fibrosis)', '肺炎（B. cepacia・嚢胞性線維症）', 'C S', 'Unknown',
  'Avoid exposure to other persons with CF; private room preferred. Criteria for discontinuation not established.',
  { durationJa: '不明', commentsJa: '他のCF患者との接触を避ける。個室が望ましい。解除基準は未確立。' });
r('Pneumonia', 'Chlamydia', '肺炎（クラミジア）', 'S', 'n/a', null);
r('Pneumonia', 'Fungal', '肺炎（真菌性）', 'S', 'n/a', null);
r('Pneumonia', 'Haemophilus influenzae type b (adults)', '肺炎（Hib・成人）', 'S', 'n/a', null);
r('Pneumonia', 'Haemophilus influenzae type b (infants/children)', '肺炎（Hib・乳幼児）', 'D S',
  'Until 24h after effective therapy', null, { durationJa: '有効治療開始後24時間まで' });
r('Pneumonia', 'Legionella spp.', '肺炎（レジオネラ）', 'S', 'n/a', null);
r('Pneumonia', 'Meningococcal', '肺炎（髄膜炎菌）', 'D S', 'Until 24h after effective therapy',
  'See Meningococcal Disease.', { durationJa: '有効治療開始後24時間まで' });
r('Pneumonia', 'Mycoplasma (primary atypical)', '肺炎（マイコプラズマ・原発性異型）', 'D S', 'Duration of illness',
  null, { durationJa: '罹病期間' });
r('Pneumonia', 'Pneumococcal', '肺炎（肺炎球菌）', 'S', 'n/a',
  'Use Droplet Precautions if evidence of transmission within a unit or facility.',
  { commentsJa: '施設内伝播の証拠があれば飛沫予防。' });
r('Pneumonia', 'Pneumocystis jiroveci', '肺炎（ニューモシスチス）', 'S', 'n/a',
  'Avoid placement in the same room with an immunocompromised patient.',
  { aliases: ['PCP', 'PJP', 'ニューモシスチス'], commentsJa: '免疫不全患者と同室にしない。' });
r('Pneumonia', 'Staphylococcus aureus', '肺炎（黄色ブドウ球菌）', 'S', 'n/a', 'For MRSA, see MDROs.',
  { aliases: ['MRSA'], commentsJa: 'MRSAはMDRO参照。' });
r('Pneumonia', 'Streptococcus group A (adults)', '肺炎（A群溶連菌・成人）', 'D S', 'Until 24h after effective therapy',
  'Contact Precautions if skin lesions present.', { durationJa: '有効治療開始後24時間まで', commentsJa: '皮膚病変があれば接触予防。' });
r('Pneumonia', 'Streptococcus group A (infants/children)', '肺炎（A群溶連菌・乳幼児）', 'D S',
  'Until 24h after effective therapy', 'Contact Precautions if skin lesions present.',
  { durationJa: '有効治療開始後24時間まで', commentsJa: '皮膚病変があれば接触予防。' });
r('Pneumonia', 'Viral (adults)', '肺炎（ウイルス性・成人）', 'S', 'n/a', null);
r('Poliomyelitis', null, 'ポリオ（急性灰白髄炎）', 'C S', 'Duration of illness', null,
  { aliases: ['polio', 'ポリオ'], durationJa: '罹病期間' });
r('Pressure ulcer', 'Infected, major', '褥瘡（感染・大）', 'C S', 'Duration of illness',
  'Until drainage stops or can be contained by dressing.',
  { aliases: ['じょくそう', 'decubitus'], durationJa: '罹病期間', commentsJa: '排膿が止まる／被覆材で制御できるまで。' });
r('Pressure ulcer', 'Infected, minor or limited', '褥瘡（感染・軽微）', 'S', 'n/a',
  'If dressing covers and contains drainage.', { commentsJa: '被覆材で排膿を覆い制御できる場合。' });
r('Psittacosis (ornithosis)', null, 'オウム病', 'S', 'n/a', 'Not transmitted from person to person.',
  { aliases: ['オウム病'], commentsJa: 'ヒト-ヒト感染しない。' });

/* ========================= Q ========================= */
r('Q fever', null, 'Q熱', 'S', 'n/a', null, { aliases: ['Qねつ'] });

/* ========================= R ========================= */
r('Rabies', null, '狂犬病', 'S', 'n/a',
  'Person-to-person transmission rare; via corneal/tissue/organ transplants reported. If bitten or saliva contaminates a wound/mucous membrane, wash thoroughly and give postexposure prophylaxis.',
  { aliases: ['きょうけんびょう'], commentsJa: 'ヒト-ヒト感染はまれ。咬傷・唾液曝露時は洗浄し曝露後予防。' });
r('Rat-bite fever', null, '鼠咬症', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Relapsing fever', null, '回帰熱', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Respiratory infectious disease, acute', 'Adults', '急性呼吸器感染症（成人・他項目外）', 'S', 'n/a', null);
r('Respiratory infectious disease, acute', 'Infants and young children', '急性呼吸器感染症（乳幼児）', 'C S',
  'Duration of illness', 'Also see syndromes/conditions in Table 2.',
  { durationJa: '罹病期間', commentsJa: 'Table 2の症候群も参照。' });
r('Respiratory syncytial virus (RSV)', null, 'RSウイルス感染症', 'C S', 'Duration of illness',
  'Infants, young children and immunocompromised adults. Wear mask per Standard Precautions. In immunocompromised, extend Contact due to prolonged shedding; reliability of antigen testing to guide removal uncertain.',
  { aliases: ['RSV', 'RSウイルス'], durationJa: '罹病期間',
    commentsJa: '免疫不全者は排出遷延のため接触予防を延長。抗原検査での解除判断は信頼性不確実。' });
r('Reye’s syndrome', null, 'ライ症候群', 'S', 'n/a', 'Not an infectious condition.',
  { commentsJa: '感染症ではない。' });
r('Rheumatic fever', null, 'リウマチ熱', 'S', 'n/a', 'Not an infectious condition.',
  { commentsJa: '感染症ではない。' });
r('Rhinovirus', null, 'ライノウイルス', 'D S', 'Duration of illness',
  'Droplet most important route. Add Contact Precautions if copious moist secretions and close contact likely (e.g., young infants).',
  { aliases: ['ライノ', '鼻かぜ'], durationJa: '罹病期間', commentsJa: '飛沫が主経路。分泌物が多く濃厚接触が想定されれば接触予防を追加。' });
r('Rickettsial fevers, tickborne', null, 'リケッチア熱（ダニ媒介）', 'S', 'n/a',
  'Rocky Mountain spotted fever, tickborne typhus. Not transmitted person to person except through transfusion, rarely.',
  { commentsJa: '輸血によるまれな例外を除きヒト-ヒト感染しない。' });
r('Rickettsialpox', null, 'リケッチア痘', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Ringworm (dermatophytosis)', null, '白癬（皮膚糸状菌症）', 'S', 'n/a',
  'Rarely, outbreaks in healthcare settings. Use Contact Precautions for outbreak.',
  { aliases: ['tinea', 'はくせん', 'みずむし'], commentsJa: 'まれに院内流行。流行時は接触予防。' });
r('Rocky Mountain spotted fever', null, 'ロッキー山紅斑熱', 'S', 'n/a',
  'Not transmitted person to person except through transfusion, rarely.',
  { aliases: ['RMSF'], commentsJa: '輸血によるまれな例外を除きヒト-ヒト感染しない。' });
r('Roseola infantum', null, '突発性発疹', 'S', 'n/a', 'Exanthem subitum; caused by HHV-6.',
  { aliases: ['HHV-6', 'とっぱつせいほっしん'] });
r('Rotavirus infection', null, 'ロタウイルス感染症', '', 'n/a', null, { seeAlso: 'Gastroenteritis', aliases: ['ロタ'] });
r('Rubella (German measles)', null, '風疹', 'D S', 'Until 7 days after onset of rash',
  'Susceptible HCWs should not enter room if immune caregivers available. Non-immune pregnant women should not care for these patients. Vaccine within 3 days of exposure.',
  { aliases: ['rubella', 'ふうしん', '三日はしか'], durationJa: '発疹出現後7日まで',
    commentsJa: '免疫のある医療者がいれば感受性者は入室しない。非免疫の妊婦はケアしない。曝露後3日以内にワクチン。' });

/* ========================= S ========================= */
r('Salmonellosis', null, 'サルモネラ症', '', 'n/a', null, { seeAlso: 'Gastroenteritis' });
r('Scabies', null, '疥癬', 'C S', 'Until 24h after effective therapy', null,
  { aliases: ['scabies', 'かいせん'], durationJa: '有効治療開始後24時間まで' });
r('Scalded skin syndrome, staphylococcal', null, 'ブドウ球菌性熱傷様皮膚症候群（SSSS）', 'C S', 'Duration of illness',
  'See Staphylococcal Disease, scalded skin syndrome.', { aliases: ['SSSS'], durationJa: '罹病期間' });
r('Schistosomiasis (bilharziasis)', null, '住血吸虫症', 'S', 'n/a', null);
r('Severe acute respiratory syndrome (SARS)', null, '重症急性呼吸器症候群（SARS）', 'A D C S',
  'Duration of illness + 10 days after fever resolves',
  'Airborne preferred; Droplet if AIIR unavailable. N95 or higher; eye protection. Aerosol-generating procedures and "supershedders" highest risk. Vigilant environmental disinfection.',
  { aliases: ['SARS', 'サーズ'], durationJa: '罹病期間＋解熱後10日（呼吸器症状の消失・改善まで）',
    commentsJa: '空気予防が望ましい（AIIRなければ飛沫）。N95以上＋眼保護。エアロゾル発生手技と大量排出者が最高リスク。環境消毒を徹底。' });
r('Smallpox (variola)', null, '天然痘', 'A C S', 'Duration of illness',
  'Until all scabs have crusted and separated (3-4 weeks). Non-vaccinated HCWs should not provide care when immune HCWs available; N95 or higher; postexposure vaccine within 4 days protective.',
  { aliases: ['variola', 'てんねんとう', '痘瘡'], durationJa: '罹病期間',
    commentsJa: '全ての痂皮が形成・脱落するまで（3-4週）。免疫HCWがいれば未接種者はケアしない。N95以上。曝露後4日以内のワクチンが有効。' });
r('Sporotrichosis', null, 'スポロトリコーシス', 'S', 'n/a', null);
r('Staphylococcal disease (S. aureus)', 'Skin/wound/burn, major', '黄色ブドウ球菌感染症（皮膚・創・熱傷／大）', 'C S',
  'Duration of illness', 'Until drainage stops or can be contained by dressing.',
  { aliases: ['MSSA', 'MRSA', 'ブドウ球菌'], durationJa: '罹病期間', commentsJa: '排膿が止まる／被覆材で制御できるまで。' });
r('Staphylococcal disease (S. aureus)', 'Skin/wound/burn, minor', '黄色ブドウ球菌感染症（皮膚・創・熱傷／軽微）', 'S', 'n/a',
  'If dressing covers and contains drainage adequately.', { commentsJa: '被覆材で排膿を十分覆える場合。' });
r('Staphylococcal disease (S. aureus)', 'Enterocolitis', '黄色ブドウ球菌感染症（腸炎）', 'S', 'n/a',
  'Use Contact Precautions for diapered or incontinent children for duration of illness.',
  { commentsJa: 'おむつ・失禁の小児は罹病期間中に接触予防。' });
r('Staphylococcal disease (S. aureus)', 'Pneumonia', '黄色ブドウ球菌感染症（肺炎）', 'S', 'n/a', null);
r('Staphylococcal disease (S. aureus)', 'Scalded skin syndrome', '黄色ブドウ球菌感染症（SSSS）', 'C S', 'Duration of illness',
  'Consider HCP as potential source of nursery/NICU outbreak.',
  { aliases: ['SSSS'], durationJa: '罹病期間', commentsJa: '新生児室/NICU流行では医療者が感染源となりうる。' });
r('Staphylococcal disease (S. aureus)', 'Toxic shock syndrome', '黄色ブドウ球菌感染症（TSS）', 'S', 'n/a', null,
  { aliases: ['TSS'] });
r('Streptococcal disease (group A)', 'Skin/wound/burn, major', 'A群溶連菌感染症（皮膚・創・熱傷／大）', 'C D S',
  'Until 24h after effective therapy', 'Until drainage stops or can be contained by dressing.',
  { aliases: ['GAS', '溶連菌'], durationJa: '有効治療開始後24時間まで', commentsJa: '排膿が止まる／被覆材で制御できるまで。' });
r('Streptococcal disease (group A)', 'Skin/wound/burn, minor', 'A群溶連菌感染症（皮膚・創・熱傷／軽微）', 'S', 'n/a',
  'If dressing covers and contains drainage.', { commentsJa: '被覆材で排膿を覆える場合。' });
r('Streptococcal disease (group A)', 'Endometritis (puerperal sepsis)', 'A群溶連菌感染症（子宮内膜炎・産褥敗血症）', 'S', 'n/a', null);
r('Streptococcal disease (group A)', 'Pharyngitis (infants/children)', 'A群溶連菌感染症（咽頭炎・乳幼児）', 'D S',
  'Until 24h after effective therapy', null, { durationJa: '有効治療開始後24時間まで' });
r('Streptococcal disease (group A)', 'Pneumonia', 'A群溶連菌感染症（肺炎）', 'D S', 'Until 24h after effective therapy',
  null, { durationJa: '有効治療開始後24時間まで' });
r('Streptococcal disease (group A)', 'Scarlet fever (infants/children)', 'A群溶連菌感染症（猩紅熱・乳幼児）', 'D S',
  'Until 24h after effective therapy', null, { aliases: ['scarlet', 'しょうこうねつ'], durationJa: '有効治療開始後24時間まで' });
r('Streptococcal disease (group A)', 'Serious invasive disease', 'A群溶連菌感染症（重症侵襲性）', 'D S',
  'Until 24h after effective therapy',
  'Outbreaks of serious invasive disease reported. Contact Precautions for draining wound; follow antimicrobial prophylaxis recommendations.',
  { durationJa: '有効治療開始後24時間まで', commentsJa: '重症侵襲性のアウトブレイク報告。排膿創は接触予防、抗菌薬予防に従う。' });
r('Streptococcal disease (group B), neonatal', null, 'B群溶連菌感染症（新生児）', 'S', 'n/a', null, { aliases: ['GBS'] });
r('Streptococcal disease (not group A or B)', null, '溶連菌感染症（A・B群以外）', 'S', 'n/a', 'Unless covered elsewhere.', {});
r('Strongyloidiasis', null, '糞線虫症', 'S', 'n/a', null);
r('Syphilis', 'Latent / seropositive without lesions', '梅毒（潜伏・無病変血清陽性）', 'S', 'n/a', null,
  { aliases: ['syphilis', 'ばいどく'] });
r('Syphilis', 'Skin and mucous membrane (incl. congenital, primary, secondary)', '梅毒（皮膚・粘膜、先天／1期／2期）', 'S', 'n/a',
  null, { aliases: ['ばいどく'] });

/* ========================= T ========================= */
r('Tapeworm disease', 'Hymenolepis nana', '条虫症（小形条虫）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Tapeworm disease', 'Taenia solium (pork)', '条虫症（有鉤条虫）', 'S', 'n/a', null);
r('Tapeworm disease', 'Other', '条虫症（その他）', 'S', 'n/a', null);
r('Tetanus', null, '破傷風', 'S', 'n/a', 'Not transmitted from person to person.',
  { aliases: ['はしょうふう'], commentsJa: 'ヒト-ヒト感染しない。' });
r('Tinea (ringworm)', null, '白癬（みずむし・たむし）', 'S', 'n/a', 'Rare episodes of person-to-person transmission.',
  { aliases: ['みずむし', 'はくせん'], commentsJa: 'ヒト-ヒト感染はまれ。' });
r('Toxoplasmosis', null, 'トキソプラズマ症', 'S', 'n/a',
  'Person-to-person transmission rare; vertical, organ and blood transfusion transmission rare.',
  { aliases: ['トキソプラズマ'], commentsJa: 'ヒト-ヒト感染はまれ（母子・移植・輸血）。' });
r('Toxic shock syndrome', null, '毒素性ショック症候群（TSS）', 'S', 'n/a',
  'Droplet Precautions for first 24h of antibiotic therapy if Group A Streptococcus is a likely etiology.',
  { aliases: ['TSS'], commentsJa: 'A群溶連菌が疑われる場合は抗菌薬開始後24時間飛沫予防。' });
r('Trachoma, acute', null, 'トラコーマ（急性）', 'S', 'n/a', null);
r('Trench mouth (Vincent’s angina)', null, '塹壕口内炎（ワンサンアンギナ）', 'S', 'n/a', null);
r('Trichinosis', null, '旋毛虫症', 'S', 'n/a', null);
r('Trichomoniasis', null, 'トリコモナス症', 'S', 'n/a', null);
r('Trichuriasis (whipworm)', null, '鞭虫症', 'S', 'n/a', null);
r('Tuberculosis (M. tuberculosis)', 'Extrapulmonary, draining lesion', '結核（肺外・排膿病変）', 'A C S', 'See comments',
  'Discontinue precautions only when improving clinically and drainage ceased or 3 consecutive negative cultures. Examine for active pulmonary TB.',
  { aliases: ['TB', 'けっかく', '結核'], durationJa: '臨床改善かつ排膿停止／培養3回陰性まで',
    commentsJa: '臨床改善し排膿停止、または連続3回培養陰性まで解除しない。活動性肺結核を検索。' });
r('Tuberculosis (M. tuberculosis)', 'Extrapulmonary, no draining lesion / meningitis', '結核（肺外・排膿なし／髄膜炎）', 'S', 'n/a',
  'Examine for evidence of pulmonary TB. For infants/children, use Airborne until active pulmonary TB in visiting family ruled out.',
  { aliases: ['TB', '結核'], commentsJa: '肺結核の有無を検索。小児は面会家族の活動性肺結核を除外するまで空気予防。' });
r('Tuberculosis (M. tuberculosis)', 'Pulmonary or laryngeal, confirmed', '結核（肺・喉頭／確定）', 'A S', 'See comments',
  'Discontinue only when on effective therapy, improving clinically, and 3 consecutive sputum smears negative for AFB collected on separate days.',
  { aliases: ['TB', '結核', '肺結核'], durationJa: '有効治療・臨床改善・塗抹3回陰性まで',
    commentsJa: '有効治療下で臨床改善し、別日に採取した喀痰塗抹が連続3回抗酸菌陰性になるまで。' });
r('Tuberculosis (M. tuberculosis)', 'Pulmonary or laryngeal, suspected', '結核（肺・喉頭／疑い）', 'A S', 'See comments',
  'Discontinue only when infectious TB deemed negligible and either another diagnosis explains the syndrome or 3 sputum smears for AFB are negative (each 8-24h apart, ≥1 early morning).',
  { aliases: ['TB', '結核'], durationJa: '感染性が無視できると判断されるまで',
    commentsJa: '感染性TBが無視できると判断され、別診断が説明可能か塗抹3回陰性になるまで解除しない。' });
r('Tuberculosis (M. tuberculosis)', 'Skin-test positive, no active disease', '結核（皮膚反応陽性・活動性なし）', 'S', 'n/a',
  null, { aliases: ['TB', '結核'] });
r('Tularemia', 'Draining lesion', '野兎病（排膿病変）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Tularemia', 'Pulmonary', '野兎病（肺）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });
r('Typhoid fever', null, '腸チフス', '', 'n/a', null, { seeAlso: 'Gastroenteritis', aliases: ['ちょうチフス', 'typhoid'] });
r('Typhus', 'Rickettsia prowazekii (epidemic/louse-borne)', 'チフス（発疹チフス・シラミ媒介）', 'S', 'n/a',
  'Transmitted person to person through close personal or clothing contact.',
  { commentsJa: '濃厚接触や衣類を介してヒト-ヒト感染する。' });
r('Typhus', 'Rickettsia typhi', 'チフス（発疹熱）', 'S', 'n/a', 'Not transmitted from person to person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });

/* ========================= U ========================= */
r('Urinary tract infection', null, '尿路感染症', 'S', 'n/a', 'Including pyelonephritis, with or without catheter.',
  { aliases: ['UTI', '尿路感染'], commentsJa: '腎盂腎炎を含む。カテーテル有無問わず。' });

/* ========================= V ========================= */
r('Vaccinia', null, '種痘（ワクシニア）', 'S', 'n/a',
  'Vaccination site care: semi-permeable dressing over gauze until scab separates (~3-5 days); gloves and hand hygiene for dressing change.',
  { commentsJa: '接種部位ケア：痂皮脱落まで半透過性被覆（約3-5日）。被覆交換時は手袋・手指衛生。' });
r('Vaccinia (adverse events)', 'Eczema vaccinatum / fetal / generalized / progressive', 'ワクシニア有害事象（湿疹性・胎児・全身性・進行性）', 'C S',
  'Until lesions dry and crusted, scabs separated', 'For contact with virus-containing lesions and exudative material.',
  { durationJa: '病変が乾燥・被殻化し痂皮が脱落するまで', commentsJa: 'ウイルス含有病変・滲出物との接触に対して。' });
r('Vaccinia (adverse events)', 'Blepharitis or conjunctivitis', 'ワクシニア有害事象（眼瞼炎・結膜炎）', 'C S', 'n/a',
  'Use Contact Precautions if there is copious drainage.', { commentsJa: '大量排膿があれば接触予防。' });
r('Vaccinia (adverse events)', 'Secondary bacterial infection', 'ワクシニア有害事象（二次細菌感染）', 'C S', 'n/a',
  'Follow organism-specific (strep, staph most frequent) recommendations and consider magnitude of drainage.',
  { commentsJa: '起因菌別（溶連菌・ブドウ球菌が多い）の推奨に従い、排膿量を考慮。' });
r('Varicella Zoster', null, '水痘（水ぼうそう）', 'A C S', 'Until lesions dry and crusted',
  'Susceptible HCWs should not enter room if immune caregivers available. In immunocompromised host with varicella pneumonia, prolong precautions for duration of illness. Postexposure vaccine within 120h; VZIG within 10 days if vaccine contraindicated. Exclude exposed susceptible HCWs day 8-21 after exposure.',
  { aliases: ['varicella', 'chickenpox', 'みずぼうそう', 'すいとう', 'VZV'], updated: '2019-04',
    durationJa: '全病変が乾燥・被殻化するまで',
    commentsJa: '免疫のある医療者がいれば感受性者は入室しない。曝露後120時間以内にワクチン、ワクチン禁忌ならVZIGを10日以内。' });
r('Variola', null, '痘瘡（天然痘）', '', 'n/a', null, { seeAlso: 'Smallpox', aliases: ['てんねんとう'] });
r('Vincent’s angina (trench mouth)', null, 'ワンサンアンギナ（塹壕口内炎）', 'S', 'n/a', null);
r('Viral hemorrhagic fevers (VHF)', null, 'ウイルス性出血熱（VHF）', '', 'See comments',
  'Due to Lassa, Marburg, Ebola, Crimean-Congo, and South American HF viruses (Junin, Machupo, Chapare, Guanarito, Sabia). Follow current CDC PPE guidance for clinically stable vs. confirmed/unstable patients. Duration case-by-case with health authorities.',
  { aliases: ['VHF', 'エボラ', 'ラッサ', 'マールブルグ', '出血熱'], updated: '2024-09', durationJa: '個別判断',
    commentsJa: 'ラッサ・マールブルグ・エボラ・クリミアコンゴ・南米出血熱。臨床安定と確定/不安定でCDCのPPE指針が異なる。期間は保健当局と個別協議。' });
r('Viral respiratory diseases (not covered elsewhere)', 'Adults', 'ウイルス性呼吸器疾患（成人・他項目外）', 'S', 'n/a', null);

/* ========================= W ========================= */
r('Whooping cough', null, '百日咳', '', 'n/a', null, { seeAlso: 'Pertussis', aliases: ['ひゃくにちぜき'] });
r('Wound infections', 'Major', '創感染（大）', 'C S', 'Duration of illness',
  'Until drainage stops or can be contained by dressing.',
  { durationJa: '罹病期間', commentsJa: '排膿が止まる／被覆材で制御できるまで。' });
r('Wound infections', 'Minor or limited', '創感染（軽微）', 'S', 'n/a', 'If dressing covers and contains drainage.',
  { commentsJa: '被覆材で排膿を覆える場合。' });

/* ========================= Y ========================= */
r('Yersinia enterocolitica gastroenteritis', null, 'エルシニア腸炎', '', 'n/a', null, { seeAlso: 'Gastroenteritis' });

/* ========================= Z ========================= */
r('Zoster (varicella-zoster)', null, '帯状疱疹', '', 'n/a', null,
  { seeAlso: 'Herpes Zoster', aliases: ['たいじょうほうしん', 'shingles'] });
r('Zygomycosis (mucormycosis)', null, 'ムコール症（接合菌症）', 'S', 'n/a', 'Not transmitted person-to-person.',
  { commentsJa: 'ヒト-ヒト感染しない。' });

const dataset = {
  meta: {
    title: 'CDC Isolation Precautions — Appendix A',
    subtitle: 'Type and Duration of Precautions Recommended for Selected Infections and Conditions',
    source: 'Guideline for Isolation Precautions (2007), CDC',
    sourceUrl:
      'https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-type-duration.html',
    webVersionDate: '2025-02-02',
    license: 'U.S. Government work (public domain). N95® is a certification mark of HHS.',
    generatedAt: new Date().toISOString().slice(0, 10),
    count: R.length,
  },
  records: R,
};

const out = resolve(__dirname, '..', 'data', 'appendix-a.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(dataset, null, 2) + '\n');
console.log(`Wrote ${R.length} records → ${out}`);
