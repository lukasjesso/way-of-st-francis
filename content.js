// All words in the game live here. Edit text in this file only; logic.js and ui.js never hold copy.
// Citation style: "Pelikan 134" = Jesus Through the Centuries, ch. 11 (Session 15 packet).
// Scripture is KJV. Where Pelikan quotes scripture in his own (modern) wording, the KJV is used instead.
(function (root) {
  'use strict';

  const content = {
    title: 'The Way of St. Francis',
    subtitle: 'Journeying to Heaven with Christ the Way and Paradigm and Christ as Brother and Friend',
    course: 'THEO 20262 · The Person of Christ · Sessions 15 & 16',

    roster: [
      { id: 'francis', name: 'St. Francis of Assisi',
        caption: 'Giotto (attrib.), The Dream of Pope Innocent III', session: 'Pelikan ch. 11 · Session 15' },
      { id: 'adam', name: 'Adam',
        caption: 'Michelangelo, The Creation of Adam', session: 'Session 13' },
      { id: 'moses', name: 'Moses',
        caption: 'Michael Damaskinos, Moses', session: 'Session 11' },
      { id: 'damascene', name: 'St. John of Damascus',
        caption: 'Michael Damaskinos, Moses', session: 'Session 11' },
      { id: 'magus', name: 'A Magus',
        caption: 'Giotto, Adoration of the Magi', session: 'Session 5' },
      { id: 'disciple', name: 'A Sleeping Disciple',
        caption: 'Perugino, Agony in the Garden', session: 'Session 6' },
      { id: 'menas', name: 'Abba Menas',
        caption: 'Christ and Abba Menas', session: 'Session 16' },
      { id: 'cash', name: 'Johnny Cash',
        caption: '“Personal Jesus”', session: 'Session 1' },
    ],

    guideIntro: {
      heading: 'Your Guide',
      img: 'assets/menas-icon.jpg',
      caption: 'Christ and Abba Menas (6th century) · Session 16',
      text: 'In a sixth-century icon, Christ rests his arm on the shoulder of Abba Menas. He will walk beside you the same way. Francis was called “the second Christ” (Pelikan 133); walk his way, as he walked Christ’s.',
      verse: '“Take my yoke upon you, and learn of me; for I am meek and lowly in heart.”',
      verseCite: 'Matthew 11:29 · title of Session 15',
    },

    // Buddy Christ opens every correction with one of these, in turn. The first fall also shows the motto.
    buddyMotto: { text: '“A friend, then, if he is a true one, hides nothing.”', cite: 'St. Ambrose, Duties of the Clergy 3.22.135 · Session 16' },
    buddyOpeners: [
      'Not that door, friend. A true friend tells you why:',
      'Close, brother, but close is not the Way.',
      'Up you get. I am not ashamed to call you brother. Here is where it went wrong:',
      'That one was a trap door. Let me show you the mark it missed:',
    ],

    buddyPitCaption: 'Buddy Christ (20th century), Session 16: Christ as friend, who tells you the truth.',

    helpLine: { text: '“For in that he himself hath suffered being tempted, he is able to succour them that are tempted.”', cite: 'Hebrews 2:18' },

    stations: [
      {
        id: 'knight', scenery: 'town', sky: 'day', numeral: 'I', title: 'The Merchant’s Son', place: 'Assisi', date: 'Youth', cite: 'Pelikan 133',
        scene: 'Giovanni di Bernardone, born “in 1181 or 1182 to a merchant family in Assisi,” has money, friends, and a dream: “he aspired to the rank of knight, and to a chivalric career.”',
        guide: { text: '“Ye have not chosen me, but I have chosen you.”', cite: 'John 15:16' },
        doors: [
          { label: 'Ride out for glory and the rank of knight', best: false, cite: 'Pelikan 133–34',
            correction: 'That was Francis’s old dream, and the very “old manner of life” his conversion moved him away from. He became a knight of a different King.' },
          { label: 'Stay home and grow the family business', best: false, cite: 'Pelikan 133–34',
            correction: 'Safe and respectable, but the merchant’s house is what Francis left. His conversion was a “movement away from his old manner of life,” toward poverty, not profit.' },
          { label: 'Become a knight of the cross: a herald of the great King', best: true, cite: 'Pelikan 133',
            pass: 'Instead of the chivalric career, “he was converted to be a chevalier of the cross of Christ and the ‘herald of the great King.’”' },
        ],
      },
      {
        id: 'repair', scenery: 'ruin', sky: 'day', numeral: 'II', title: '“Repair My House”', place: 'A ruined church near Assisi', date: 'Before 1209', cite: 'Pelikan 134',
        scene: 'At prayer, Francis beholds the figure of the crucified Christ and hears a specific instruction: “go and repair my house [the church], which is in total disrepair.”',
        guide: { text: '“If any man will come after me, let him deny himself, and take up his cross, and follow me.”', cite: 'Matthew 16:24 · the summons Pelikan says Francis heard (134)' },
        doors: [
          { label: 'Wait until you fully understand what the vision means', best: false, cite: 'John 15:14 · Pelikan 134',
            correction: '“Ye are my friends, if ye do whatsoever I command you.” Francis’s understanding came “gradually,” in the doing, not before it.' },
          { label: 'March to Rome and tell the pope how to reform the whole Church', best: false, cite: 'Pelikan 134, 143',
            correction: 'Zeal before obedience. Francis began with the stones in front of him; only “gradually” did he see that the house was the whole Church. And when he did go to Rome, it was to ask, not to instruct.' },
          { label: 'Pick up stones and rebuild the ruined church in front of you', best: true, cite: 'Pelikan 134',
            pass: '“At first Francis interpreted this command in a literal sense, undertaking to repair several church buildings in the vicinity.” Gradually it dawned on him that the house was “the very church of Christ on earth.”' },
        ],
      },
      {
        id: 'nogold', scenery: 'arcade', sky: 'day', numeral: 'III', title: 'Take No Gold', place: '', date: '24 February 1209', cite: 'Pelikan 134 · Matthew 10:7, 9',
        scene: 'Francis hears the words Jesus spoke when he first sent out the twelve, and takes them as spoken to him: “as ye go, preach, saying, The kingdom of heaven is at hand… Provide neither gold, nor silver, nor brass in your purses.”',
        guide: { text: '“As the Father hath loved me, so have I loved you: continue ye in my love.”', cite: 'John 15:9' },
        brothersAfter: 5,
        doors: [
          { label: 'Keep a small purse, just enough to be safe', best: false, cite: 'Pelikan 134',
            correction: 'A half-measure. It was “because of its austerity,” not in spite of it, that people came to share this way of life.' },
          { label: 'Give it all away, then withdraw to pray alone', best: false, cite: 'Matthew 10:7 · Pelikan 134',
            correction: 'The command is to “preach” as you go, not to hide. And Francis did not stay alone: others came “who wanted to share this radically evangelical way of life.”' },
          { label: 'Take nothing for the road, and go out preaching', best: true, cite: 'Pelikan 134',
            pass: '“Francis almost immediately began to attract followers… first there were five.” The way of Christ is not walked alone.' },
        ],
      },
      {
        id: 'innocent', scenery: 'palace', sky: 'day', numeral: 'IV', title: 'Before the Pope', place: 'Rome', date: '1209 or 1210', cite: 'Pelikan 135, 143',
        art: { img: 'assets/giotto-dream.jpg', caption: 'Giotto (attrib.), The Dream of Pope Innocent III' },
        scene: 'Francis brings his little Rule, which used “for the most part the words of the holy Gospel.” Innocent III will not answer until he consults the cardinals, some of whom see “parallels between the preachments of various heretical movements” and Francis’s radical poverty.',
        guide: { text: '“Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine…”', cite: 'John 15:4' },
        brothersAfter: 12,
        doors: [
          { label: 'Preach anyway. The Gospel needs no permission', best: false, cite: 'Pelikan 143',
            correction: 'Francis came to Rome precisely “to obtain the pope’s sanction, required for founding a new religious order.” Some cardinals already saw “parallels between the preachments of various heretical movements” and his poverty; preaching without sanction would have proved them right.' },
          { label: 'Rewrite the Rule with long regulations to satisfy the cardinals', best: false, cite: 'Pelikan 135',
            correction: 'Francis “avoided lengthy prescriptions of structure or conduct,” preferring the words of the Gospel. Bending the Gospel to win approval misses the mark.' },
          { label: 'Submit the Gospel Rule to the pope, and wait in trust', best: true, cite: 'Pelikan 143, 134',
            pass: 'In the legend Giotto painted, Innocent dreamed that night of a young man in a coarse habit, holding up the tilting Basilica of Saint John Lateran. “On the basis of the vision in the dream, the pope granted the request.” Then there were twelve.' },
        ],
      },
      {
        id: 'poverty', scenery: 'forest', sky: 'day', numeral: 'V', title: 'Lady Poverty', place: 'The woods', date: 'From an early legend', cite: 'Pelikan 137–38',
        scene: 'Searching the woods, Francis meets a woman and explains: “I have gone forth to look for poverty, for I have cast away riches, and I will go on seeking and calling her until I meet her.” Her name, she tells him, is Paupertas.',
        guide: { text: '“…ye are not of the world, but I have chosen you out of the world.”', cite: 'John 15:19' },
        brothersAfter: 3000,
        doors: [
          { label: 'Vow poverty yourself, but let the order keep lands and treasure', best: false, cite: 'Pelikan 137',
            correction: 'That was the old monastic loophole: the vow bound “the individual… but not necessarily… the order,” and monasteries grew rich in “gold and jewels.” Francis made “a radical break” with it.' },
          { label: 'Despise the world as evil and flee from all of it', best: false, cite: 'Pelikan 138',
            correction: '“It would, however, be a grave error to interpret the Franciscan detachment from material wealth as the expression of a hatred for the material and natural world.”' },
          { label: 'Take Lady Poverty as your bride', best: true, cite: 'Pelikan 138, 134',
            pass: '“He resolved to make her his bride, and the marriage was performed by Christ himself.” By 1221 there were at least three thousand brothers.' },
        ],
      },
      {
        id: 'sun', scenery: 'meadow', sky: 'day', numeral: 'VI', title: 'Brother Sun', place: '', date: 'The Canticle', cite: 'Pelikan 138',
        scene: 'Poor in everything, Francis is rich in kin. He begins a song: “All praise be yours, my Lord, through all that you have made, / And first my lord Brother Sun, / Who brings the day.”',
        guide: { text: '“I will declare thy name unto my brethren, in the midst of the church will I sing praise unto thee.”', cite: 'Hebrews 2:12 · words Hebrews gives to Christ' },
        doors: [
          { label: 'Sing it in Latin, the proper tongue of the Church', best: false, cite: 'Pelikan 138',
            correction: 'The Canticle of Brother Sun is “the first significant work in the history of Italian vernacular literature.” Francis sang in the language of his brothers.' },
          { label: 'Worship the glory of nature itself', best: false, cite: 'Pelikan 138, quoting Chesterton',
            correction: 'In Francis, says Chesterton, “man has stripped from his soul the last rag of nature-worship, and can return to nature.” The praise goes to the Lord “through all that you have made.”' },
          { label: 'Call the sun your brother and the moon your sister, and praise God through them', best: true, cite: 'Pelikan 138',
            pass: '“The moon was his sister, the wind his brother.” Christ “is not ashamed to call them brethren” (Hebrews 2:11), and neither was Francis.' },
        ],
      },
      {
        id: 'greccio', scenery: 'stable', sky: 'night', numeral: 'VII', title: 'The Crèche at Greccio', place: 'Greccio', date: 'Christmas Eve 1223', cite: 'Pelikan 139',
        scene: 'Francis, says Thomas of Celano, “observed the birthday of the Child Jesus with inexpressible eagerness over all other feasts.” Midnight Mass is coming, and Francis will serve as deacon.',
        guide: { text: '“Behold I and the children which God hath given me.”', cite: 'Hebrews 2:13 · words Hebrews gives to Christ' },
        doors: [
          { label: 'Treat Christmas as a lesser feast; only Easter really matters', best: false, cite: 'Pelikan 139',
            correction: 'Francis called Christmas “the feast of feasts” (Thomas of Celano, quoted by Pelikan).' },
          { label: 'Preach only Christ’s glory: a God too high to be a helpless baby', best: false, cite: 'Pelikan 139 · Hebrews 2:14',
            correction: 'Francis brought “a new and deeper awareness of the humanity of Christ, as disclosed in his nativity.” Since we are “partakers of flesh and blood, he also himself likewise took part of the same.”' },
          { label: 'Set up a crèche and preach about the poor King, the Baby of Bethlehem', best: true, cite: 'Pelikan 139',
            pass: 'Francis “set up a presepio or crèche,” preaching “about the birth of the poor King, whom he called the Baby of Bethlehem in his tender love.”' },
        ],
      },
      {
        id: 'laverna', scenery: 'mountain', sky: 'dawn', numeral: 'VIII', title: 'The Stigmata', place: 'La Verna', date: 'September 1224', cite: 'Pelikan 136–37',
        intro: 'stigmata', grantsStigmata: true,
        introText: {
          lead: 'Forty days on the mountain. On or about the feast of the Exaltation of the Cross, 14 September, Francis beholds “a seraph with six wings,” and between its wings “the figure of the crucified Christ” (Pelikan 136).',
          bonaventure: '“There and then the marks of nails began to appear in his hands and feet, just as he had seen them in the vision of the Man nailed to the Cross.”',
          bonaventureCite: 'Bonaventure, quoted by Pelikan 136',
          paul: '“I bear in my body the marks of the Lord Jesus.”',
          paulCite: 'Galatians 6:17, the source of the word stigmata (Pelikan 136)',
          seal: 'In Dante’s Paradiso, Thomas Aquinas, “a Dominican, not a Franciscan,” calls them “the final seal.”',
        },
        scene: 'You bear the marks of the Lord Jesus in your hands and feet. Word will travel fast. What will you do with them?',
        guide: { text: '“Greater love hath no man than this, that a man lay down his life for his friends.”', cite: 'John 15:13' },
        doors: [
          { label: 'Show the wounds to the crowds as proof of your holiness', best: false, cite: 'Pelikan 137',
            correction: 'Francis “did not take the stigmata as an occasion for self-esteem.”' },
          { label: 'Make the wounds the center of your following of Christ', best: false, cite: 'Pelikan 137',
            correction: 'Francis did not “regard them as the primary form of his imitation of Christ. That place of honor, or of lack of honor, belonged rather to poverty.”' },
          { label: 'Keep them hidden, and go on following Christ in poverty', best: true, cite: 'Pelikan 137',
            pass: '“He even imitated Christ (Matt. 16:20) in keeping his special identity a secret.” The captain of our salvation was himself made “perfect through sufferings” (Hebrews 2:10), and Francis bore his marks in silence.' },
        ],
      },
      {
        id: 'death', scenery: 'chapel', sky: 'dusk', numeral: 'IX', title: 'Sister Death', place: 'The Portiuncula', date: '3 October 1226', cite: 'Pelikan 135, 138',
        final: true,
        scene: 'Francis lies dying at the little church he once rebuilt. In a stanza said to come from his last hour, Francis welcomes “Sister Death” as one more gift from God. Before you stands the last gate of the Way, and it does not open from this side. While there is breath, there is still time to turn.',
        guide: { text: '“I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit…”', cite: 'John 15:5' },
        doors: [
          { label: 'Trust your record: the poverty, the Rule, the stigmata. You have earned this gate', best: false, cite: 'John 15:5 · Pelikan 133',
            correction: 'Even “the second Christ” did not walk through on his own merits. Finish the verse: “for without me ye can do nothing.”' },
          { label: 'Face death bravely, alone, by your own strength', best: false, cite: 'Hebrews 2:14–15',
            correction: 'He took flesh “that through death he might destroy him that had the power of death… and deliver them who through fear of death were all their lifetime subject to bondage.” You were never meant to cross alone.' },
          { label: 'Submit to Christ in everything, and call on Him to take you home', best: true, cite: 'Bonaventure, quoted by Pelikan 139–40',
            pass: '“Christ hung upon his Cross, poor and naked and in great pain… and Francis wanted to be like him in everything.”' },
        ],
      },
    ],

    gate: {
      buddyLine: '“Henceforth I call you not servants; for the servant knoweth not what his lord doeth: but I have called you friends.”',
      buddyCite: 'John 15:15',
      buddyCaption: 'Buddy Christ (20th century) · Session 16',
      gregory: '“We were unworthy servants, and he calls us friends.”',
      gregoryCite: 'St. Gregory the Great, Forty Gospel Homilies 27',
      brethren: '“He is not ashamed to call them brethren.”',
      brethrenCite: 'Hebrews 2:11',
    },

    ending: {
      lead: 'No one reaches the end of the Way alone.',
      verse: '“…for without me ye can do nothing.”',
      verseCite: 'John 15:5',
      credits: [
        'Sources: 1 John 3 and Jaroslav Pelikan, Jesus Through the Centuries, ch. 11, “The Divine and Human Model” (Session 15); John 15; Hebrews 2; patristic selections on John 15 and Hebrews 2 (Session 16). Scripture: King James Version.',
        'Images: Christ and Abba Menas (6th c.); Buddy Christ (20th c.); Giotto (attrib.), The Dream of Pope Innocent III; Michelangelo, The Creation of Adam; Michael Damaskinos, Moses; Giotto, Adoration of the Magi; Perugino, Agony in the Garden; Johnny Cash, “Personal Jesus.”',
        'Made with the help of generative AI for THEO 20262, The Person of Christ, Fall 2026.',
      ],
    },
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = content;
  else root.GAME_CONTENT = content;
})(this);
