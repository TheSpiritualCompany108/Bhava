// 365 Bhagavad Gita quotes — one per day of the year
// Index 0 = Jan 1, Index 364 = Dec 31
const gitaQuotes = [
  // Chapter 2 — Sankhya Yoga
  {
    text: "You have the right to work, but never to the fruit of work. You should never engage in action for the sake of reward, nor should you long for inaction.",
    ref: "Bhagavad Gita 2:47",
  },
  {
    text: "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval.",
    ref: "Bhagavad Gita 2:20",
  },
  {
    text: "For the soul there is never birth nor death at any time. It has not come into being, does not come into being, and will not come into being.",
    ref: "Bhagavad Gita 2:20",
  },
  {
    text: "Just as a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.",
    ref: "Bhagavad Gita 2:22",
  },
  {
    text: "The soul can never be cut to pieces by any weapon, nor burned by fire, nor moistened by water, nor withered by the wind.",
    ref: "Bhagavad Gita 2:23",
  },
  {
    text: "This individual soul is unbreakable and insoluble, and can be neither burned nor dried. It is everlasting, present everywhere, unchangeable, immovable, and eternally the same.",
    ref: "Bhagavad Gita 2:24",
  },
  {
    text: "One who has controlled the mind and is unaffected by loss or gain — such a person is said to be situated in perfect knowledge, and is called a sage.",
    ref: "Bhagavad Gita 2:57",
  },
  {
    text: "A person who is not disturbed by the incessant flow of desires — that enter like rivers into the ocean, which is ever being filled but is always still — can alone achieve peace.",
    ref: "Bhagavad Gita 2:70",
  },
  {
    text: "One who abandons all desires for sense gratification, who lives free from desire, who has given up all sense of proprietorship and is devoid of false ego — he alone can attain real peace.",
    ref: "Bhagavad Gita 2:71",
  },
  {
    text: "That which pervades the entire body you should know to be indestructible. No one is able to destroy that imperishable soul.",
    ref: "Bhagavad Gita 2:17",
  },
  {
    text: "Never was there a time when I did not exist, nor you, nor all these kings; nor in the future shall any of us cease to be.",
    ref: "Bhagavad Gita 2:12",
  },
  {
    text: "The non-permanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons.",
    ref: "Bhagavad Gita 2:14",
  },
  {
    text: "O best among men, the person who is not disturbed by happiness and distress and is steady in both is certainly eligible for liberation.",
    ref: "Bhagavad Gita 2:15",
  },
  {
    text: "Those who are seers of the truth have concluded that of the non-existent there is no endurance and of the existent there is no absence.",
    ref: "Bhagavad Gita 2:16",
  },
  {
    text: "Do not grieve for those who live, and do not grieve for those who die. For of all things, death is certain and life is certain after death.",
    ref: "Bhagavad Gita 2:27",
  },
  {
    text: "Considering your specific duty as a warrior, you should know that there is no better engagement for you than fighting on religious principles.",
    ref: "Bhagavad Gita 2:31",
  },
  {
    text: "Those who are beyond the dualities that arise from doubts, whose minds are engaged within, who are always busy working for the welfare of all living beings, and who are free from all sins achieve liberation in the Supreme.",
    ref: "Bhagavad Gita 5:25",
  },
  {
    text: "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
    ref: "Bhagavad Gita 6:5",
  },
  {
    text: "For one who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, his mind will remain the greatest enemy.",
    ref: "Bhagavad Gita 6:6",
  },

  // Chapter 3 — Karma Yoga
  {
    text: "Let right deeds be thy motive, not the fruit which comes from them.",
    ref: "Bhagavad Gita 3:19",
  },
  {
    text: "It is better to perform one's own prescribed duties, even if faultily, than another's duties perfectly. Destruction in the course of performing one's own duty is better.",
    ref: "Bhagavad Gita 3:35",
  },
  {
    text: "As the ignorant perform their duties with attachment to results, the learned may similarly act, but without attachment, for the sake of leading people on the right path.",
    ref: "Bhagavad Gita 3:25",
  },
  {
    text: "Whatever action a great man performs, common men follow. And whatever standards he sets by exemplary acts, all the world pursues.",
    ref: "Bhagavad Gita 3:21",
  },
  {
    text: "The embodied soul is eternally in the living entities. It cannot be cut by any weapon. The spirit soul is indestructible. What need is there for lamentation?",
    ref: "Bhagavad Gita 3:15",
  },
  {
    text: "It is far better to perform one's natural prescribed duty, though tinged with faults, than to perform the duty of another, even though perfectly.",
    ref: "Bhagavad Gita 3:35",
  },
  {
    text: "Lust, anger, and greed — these are the three gates leading to the hell of self-destruction for the soul. Therefore all sane men give these up.",
    ref: "Bhagavad Gita 16:21",
  },
  {
    text: "Out of compassion for them, I, dwelling in their hearts, destroy with the shining lamp of knowledge the darkness born of ignorance.",
    ref: "Bhagavad Gita 10:11",
  },
  {
    text: "All created beings are unmanifest in their beginning, manifest in their interim state, and unmanifest again when annihilated. So what need is there for lamentation?",
    ref: "Bhagavad Gita 2:28",
  },

  // Chapter 4 — Jnana-Karma-Sannyas Yoga
  {
    text: "Whenever and wherever there is a decline in religious practice and a predominant rise of irreligion — at that time I descend Myself.",
    ref: "Bhagavad Gita 4:7",
  },
  {
    text: "To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of religion, I Myself appear, millennium after millennium.",
    ref: "Bhagavad Gita 4:8",
  },
  {
    text: "One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take his birth again in this material world, but attains My eternal abode.",
    ref: "Bhagavad Gita 4:9",
  },
  {
    text: "Being freed from attachment, fear and anger, being fully absorbed in Me and taking refuge in Me, many persons in the past became purified by knowledge of Me — and thus they all attained My transcendental love.",
    ref: "Bhagavad Gita 4:10",
  },
  {
    text: "As all surrender unto Me, I reward them accordingly. Everyone follows My path in all respects, O son of Prtha.",
    ref: "Bhagavad Gita 4:11",
  },
  {
    text: "Even if you are considered to be the most sinful of all sinners, when you are situated in the boat of transcendental knowledge, you will be able to cross over the ocean of miseries.",
    ref: "Bhagavad Gita 4:36",
  },
  {
    text: "As a blazing fire turns firewood to ashes, O Arjuna, so does the fire of knowledge burn to ashes all reactions to material activities.",
    ref: "Bhagavad Gita 4:37",
  },
  {
    text: "In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism. And one who has become accomplished in the practice of devotional service enjoys this knowledge within himself in due course of time.",
    ref: "Bhagavad Gita 4:38",
  },
  {
    text: "A faithful man who is dedicated to transcendental knowledge and who subdues his senses is eligible to achieve such knowledge, and having achieved it he quickly attains the supreme spiritual peace.",
    ref: "Bhagavad Gita 4:39",
  },
  {
    text: "Work done as a sacrifice for Vishnu has to be performed; otherwise work causes bondage in this material world. Therefore, O son of Kunti, perform your prescribed duties for His satisfaction, and in that way you will always remain unattached and free from bondage.",
    ref: "Bhagavad Gita 3:9",
  },

  // Chapter 5 — Karma-Sannyas Yoga
  {
    text: "A person in the divine consciousness, although engaged in seeing, hearing, touching, smelling, eating, moving about, sleeping and breathing, always knows within himself that he actually does nothing at all.",
    ref: "Bhagavad Gita 5:8",
  },
  {
    text: "The Supreme Lord is situated in everyone's heart, O Arjuna, and is directing the wanderings of all living entities, who are seated as on a machine, made of the material energy.",
    ref: "Bhagavad Gita 18:61",
  },
  {
    text: "One who neither rejoices upon achieving something pleasant nor laments upon obtaining something unpleasant, who is self-intelligent, who is unbewildered, and who knows the science of God, is already situated in transcendence.",
    ref: "Bhagavad Gita 5:20",
  },
  {
    text: "The yogis, abandoning attachment, act with body, mind, intelligence, and even with the senses, only for the purpose of purification.",
    ref: "Bhagavad Gita 5:11",
  },
  {
    text: "A person who has given up all desires for sense gratification, who lives free from desires, who has given up all sense of proprietorship, and who is devoid of false ego — he alone can attain real peace.",
    ref: "Bhagavad Gita 2:71",
  },

  // Chapter 6 — Dhyana Yoga
  {
    text: "A man must elevate himself by his own mind, not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
    ref: "Bhagavad Gita 6:5",
  },
  {
    text: "The yogi who is satisfied with knowledge and discrimination, who has conquered his senses, and to whom a lump of earth, a stone and gold are the same — is said to be self-realized and is called a yogi, or mystic.",
    ref: "Bhagavad Gita 6:8",
  },
  {
    text: "A person is said to be elevated in yoga when, having renounced all material desires, he neither acts for sense gratification nor engages in fruitive activities.",
    ref: "Bhagavad Gita 6:4",
  },
  {
    text: "He who is equal to friends and enemies, who is equipoised in honor and dishonor, heat and cold, happiness and distress, fame and infamy, who is always free from contaminating association, always silent and satisfied with anything — such a person is very dear to Me.",
    ref: "Bhagavad Gita 12:18",
  },
  {
    text: "Of all yogis, the one with great faith who always abides in Me, thinks of Me within himself, and renders transcendental loving service to Me — he is the most intimately united with Me in yoga and is the highest of all.",
    ref: "Bhagavad Gita 6:47",
  },
  {
    text: "The steadily devoted soul attains unadulterated peace because he offers the result of all activities to Me; whereas a person who is not in union with the Divine, who is greedy for the fruits of his labor, becomes entangled.",
    ref: "Bhagavad Gita 5:12",
  },
  {
    text: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.",
    ref: "Bhagavad Gita 6:19",
  },
  {
    text: "In the stage of perfection called trance, or samadhi, one's mind is completely restrained from material mental activities by practice of yoga. This perfection is characterized by one's ability to see the self by the pure mind.",
    ref: "Bhagavad Gita 6:20",
  },
  {
    text: "Everywhere is his home, nowhere is foreign — the self-controlled man who sees the Self in all beings and all beings in the Self.",
    ref: "Bhagavad Gita 6:29",
  },
  {
    text: "For those who see Me everywhere and see all things in Me, I am never lost, nor are they ever lost to Me.",
    ref: "Bhagavad Gita 6:30",
  },

  // Chapter 7 — Jnana-Vijnana Yoga
  {
    text: "I am the taste of water, the light of the sun and the moon, the syllable om in the Vedic mantras; I am the sound in ether and ability in man.",
    ref: "Bhagavad Gita 7:8",
  },
  {
    text: "I am the original fragrance of the earth, and I am the heat in fire. I am the life of all that lives, and I am the penances of all ascetics.",
    ref: "Bhagavad Gita 7:9",
  },
  {
    text: "Among thousands of men, scarcely one strives for perfection; and among those who strive and succeed, scarcely one knows Me in truth.",
    ref: "Bhagavad Gita 7:3",
  },
  {
    text: "Earth, water, fire, air, ether, mind, intelligence and false ego — all together these eight constitute My separated material energies.",
    ref: "Bhagavad Gita 7:4",
  },
  {
    text: "Those who worship Me with devotion, meditating on My transcendental form — I carry what they lack and preserve what they have.",
    ref: "Bhagavad Gita 9:22",
  },
  {
    text: "O son of Bharata, as the sun alone illuminates all this universe, so does the living entity, one within the body, illuminate the entire body by consciousness.",
    ref: "Bhagavad Gita 13:34",
  },
  {
    text: "The foolish cannot understand how a living entity can quit his body, nor can they understand what sort of body he enjoys under the spell of the modes of nature.",
    ref: "Bhagavad Gita 15:10",
  },

  // Chapter 8 — Aksara-Brahma Yoga
  {
    text: "Whoever, at the time of death, gives up the body while remembering Me alone, reaches My state. Of this there is no doubt.",
    ref: "Bhagavad Gita 8:5",
  },
  {
    text: "Whatever state of being one remembers when he quits his body, O son of Kunti, that state he will attain without fail.",
    ref: "Bhagavad Gita 8:6",
  },
  {
    text: "Therefore, at all times, remember Me in the form of Krishna and also carry out your prescribed duty of fighting. With your activities dedicated to Me and your mind and intelligence fixed on Me, you will attain Me without doubt.",
    ref: "Bhagavad Gita 8:7",
  },
  {
    text: "He who meditates on Me as the Supreme Personality of Godhead, his mind constantly engaged in remembering Me, undeviated from the path, he is sure to reach Me.",
    ref: "Bhagavad Gita 8:8",
  },
  {
    text: "From the highest planet in the material world down to the lowest, all are places of misery wherein repeated birth and death take place. But one who attains to My abode, O son of Kunti, never takes birth again.",
    ref: "Bhagavad Gita 8:16",
  },
  {
    text: "By human calculation, a thousand ages taken together form the duration of Brahma's one day. And such also is the duration of his night.",
    ref: "Bhagavad Gita 8:17",
  },
  {
    text: "At the beginning of Brahma's day, all living entities become manifest from the unmanifest state, and thereafter, when the night falls, they are merged into the unmanifest again.",
    ref: "Bhagavad Gita 8:18",
  },

  // Chapter 9 — Raja-Vidya-Raja-Guhya Yoga
  {
    text: "I am not manifested to the foolish and unintelligent. For them I am covered by My internal potency, and therefore they do not know that I am unborn and infallible.",
    ref: "Bhagavad Gita 7:25",
  },
  {
    text: "Whatever you do, whatever you eat, whatever you offer or give away, and whatever austerities you perform — do that, O son of Kunti, as an offering to Me.",
    ref: "Bhagavad Gita 9:27",
  },
  {
    text: "In this way you will be freed from bondage to work and its auspicious and inauspicious results. With your mind fixed on Me in this principle of renunciation, you will be liberated and come to Me.",
    ref: "Bhagavad Gita 9:28",
  },
  {
    text: "I envy no one, nor am I partial to anyone. I am equal to all. But whoever renders service unto Me in devotion is a friend, is in Me, and I am also a friend to him.",
    ref: "Bhagavad Gita 9:29",
  },
  {
    text: "Even if one commits the most abominable action, if he is engaged in devotional service he is to be considered saintly because he is properly situated in his determination.",
    ref: "Bhagavad Gita 9:30",
  },
  {
    text: "He quickly becomes righteous and attains lasting peace. O son of Kunti, declare it boldly that My devotee never perishes.",
    ref: "Bhagavad Gita 9:31",
  },
  {
    text: "If one offers Me with love and devotion a leaf, a flower, fruit or water, I will accept it.",
    ref: "Bhagavad Gita 9:26",
  },
  {
    text: "This knowledge is the king of education, the most secret of all secrets. It is the purest knowledge, and because it gives direct perception of the self by realization, it is the perfection of religion.",
    ref: "Bhagavad Gita 9:2",
  },

  // Chapter 10 — Vibhuti Yoga
  {
    text: "I am the source of all spiritual and material worlds. Everything emanates from Me. The wise who perfectly know this engage in My devotional service and worship Me with all their hearts.",
    ref: "Bhagavad Gita 10:8",
  },
  {
    text: "The thoughts of My pure devotees dwell in Me, their lives are fully devoted to My service, and they derive great satisfaction and bliss from always enlightening one another and conversing about Me.",
    ref: "Bhagavad Gita 10:9",
  },
  {
    text: "To those who are constantly devoted to serving Me with love, I give the understanding by which they can come to Me.",
    ref: "Bhagavad Gita 10:10",
  },
  {
    text: "I am the Self, O Gudakesha, seated in the hearts of all creatures. I am the beginning, the middle, and the end of all beings.",
    ref: "Bhagavad Gita 10:20",
  },
  {
    text: "Among the Adityas I am Vishnu, among lights I am the radiant sun, among the Maruts I am Marici, and among stars I am the moon.",
    ref: "Bhagavad Gita 10:21",
  },
  {
    text: "Of the Vedas I am the Sama Veda; of the demigods I am Indra, the king of heaven; of the senses I am the mind; and in living beings I am the living force (consciousness).",
    ref: "Bhagavad Gita 10:22",
  },
  {
    text: "Know that all opulent, beautiful and glorious creations spring from but a spark of My splendor.",
    ref: "Bhagavad Gita 10:41",
  },
  {
    text: "But what need is there, Arjuna, for all this detailed knowledge? With a single fragment of Myself I pervade and support this entire universe.",
    ref: "Bhagavad Gita 10:42",
  },

  // Chapter 11 — Vishwarupa-Darshana Yoga
  {
    text: "Time I am, the great destroyer of the worlds, and I have come here to destroy all people. With the exception of you, all the soldiers here on both sides will be slain.",
    ref: "Bhagavad Gita 11:32",
  },
  {
    text: "Therefore get up. Prepare to fight and win glory. Conquer your enemies and enjoy a flourishing kingdom. They are already put to death by My arrangement, and you, O Savyasaci, can be but an instrument in the fight.",
    ref: "Bhagavad Gita 11:33",
  },
  {
    text: "I can be seen only by undivided devotional service. Only by this means can you know Me truly, see Me, and enter into the mysteries of My being.",
    ref: "Bhagavad Gita 11:54",
  },
  {
    text: "My dear Arjuna, he who engages in My pure devotional service, free from the contaminations of fruitive activities and mental speculation, he who works for Me, who makes Me the supreme goal of his life, and who is friendly to every living being — he certainly comes to Me.",
    ref: "Bhagavad Gita 11:55",
  },

  // Chapter 12 — Bhakti Yoga
  {
    text: "Fix your mind on Me alone, rest your thoughts on Me alone, and in Me alone you will live hereafter. Of this there is no doubt.",
    ref: "Bhagavad Gita 12:8",
  },
  {
    text: "If you cannot fix your mind on Me without deviation, then follow the regulative principles of bhakti-yoga. In this way develop a desire to attain Me.",
    ref: "Bhagavad Gita 12:9",
  },
  {
    text: "If you cannot practice the regulations of bhakti-yoga, then just try to work for Me, because by working for Me you will come to the perfect stage.",
    ref: "Bhagavad Gita 12:10",
  },
  {
    text: "If, however, you are unable to work in this consciousness of Me, then try to act giving up all results of your work and try to be self-situated.",
    ref: "Bhagavad Gita 12:11",
  },
  {
    text: "Those who worship Me with devotion, meditating on My transcendental form — I carry what they lack, and I preserve what they have.",
    ref: "Bhagavad Gita 9:22",
  },
  {
    text: "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego — such a devotee is very dear to Me.",
    ref: "Bhagavad Gita 12:13",
  },
  {
    text: "One who is equal to friends and enemies, who is equipoised in honor and dishonor, heat and cold, happiness and distress, fame and infamy, who is always free from contaminating association, always silent and satisfied with anything — such a person is very dear to Me.",
    ref: "Bhagavad Gita 12:18",
  },
  {
    text: "Those who follow this imperishable path of devotional service and who completely engage themselves with faith, making Me the supreme goal, are very, very dear to Me.",
    ref: "Bhagavad Gita 12:20",
  },

  // Chapter 13 — Ksetra-Ksetrajna Vibhaga Yoga
  {
    text: "Humility, pridelessness, nonviolence, tolerance, simplicity, approaching a bona fide spiritual master, cleanliness, steadiness and self-control — all these I declare to be knowledge.",
    ref: "Bhagavad Gita 13:8",
  },
  {
    text: "Renunciation of the objects of sense gratification; absence of false ego, the perception of the evil of birth, death, old age and disease — these I declare to be knowledge.",
    ref: "Bhagavad Gita 13:9",
  },
  {
    text: "Nonattachment to children, wife, home and the rest, and evenmindedness amid pleasant and unpleasant events — this I declare to be knowledge.",
    ref: "Bhagavad Gita 13:10",
  },
  {
    text: "Constant and unalloyed devotion and worship to Me, resorting to solitary places, distaste for the society of people in general — these I declare to be knowledge.",
    ref: "Bhagavad Gita 13:11",
  },
  {
    text: "I shall now explain the knowable, knowing which you will taste the eternal. Brahman, the spirit, beginningless and subordinate to Me, lies beyond the cause and effect of this material world.",
    ref: "Bhagavad Gita 13:13",
  },
  {
    text: "Everywhere are His hands and legs, His eyes, heads and faces, and He has ears everywhere. In this way the Supersoul exists, pervading everything.",
    ref: "Bhagavad Gita 13:14",
  },
  {
    text: "The Supersoul is the original source of all senses, yet He is without senses. He is unattached, although He is the maintainer of all living beings. He transcends the modes of nature, and at the same time He is the master of all modes of material nature.",
    ref: "Bhagavad Gita 13:15",
  },

  // Chapter 14 — Gunatraya-Vibhaga Yoga
  {
    text: "Material nature consists of three modes — goodness, passion and ignorance. When the eternal living entity comes in contact with nature, O mighty-armed Arjuna, he becomes conditioned by these modes.",
    ref: "Bhagavad Gita 14:5",
  },
  {
    text: "O sinless one, the mode of goodness, being purer than the others, is illuminating, and it frees one from all sinful reactions. Those situated in that mode become conditioned by a sense of happiness and knowledge.",
    ref: "Bhagavad Gita 14:6",
  },
  {
    text: "The mode of passion is born of unlimited desires and longings, O son of Kunti, and because of this the embodied living entity is bound to material fruitive actions.",
    ref: "Bhagavad Gita 14:7",
  },
  {
    text: "O son of Bharata, know that the mode of darkness, born of ignorance, is the delusion of all embodied living entities. The results of this mode are madness, indolence and sleep, which bind the conditioned soul.",
    ref: "Bhagavad Gita 14:8",
  },
  {
    text: "One who is not affected by the three modes of material nature and who transcends them is liberated from birth, death, old age and their distresses and can enjoy nectar even in this life.",
    ref: "Bhagavad Gita 14:20",
  },
  {
    text: "He who serves Me with unwavering devotion, transcending the three qualities, is ready to be absorbed in Brahman.",
    ref: "Bhagavad Gita 14:26",
  },

  // Chapter 15 — Purushottama Yoga
  {
    text: "The Supreme Personality of Godhead said: It is said that there is an imperishable banyan tree that has its roots upward and its branches down and whose leaves are the Vedic hymns.",
    ref: "Bhagavad Gita 15:1",
  },
  {
    text: "I am seated in everyone's heart, and from Me come remembrance, knowledge and forgetfulness. By all the Vedas, I am to be known. Indeed, I am the compiler of Vedanta, and I am the knower of the Vedas.",
    ref: "Bhagavad Gita 15:15",
  },
  {
    text: "There are two classes of beings, the fallible and the infallible. In the material world every living entity is fallible, and in the spiritual world every living entity is called infallible.",
    ref: "Bhagavad Gita 15:16",
  },
  {
    text: "Because I am transcendental, beyond both the fallible and the infallible, and because I am the greatest, I am celebrated both in the world and in the Vedas as that Supreme Person.",
    ref: "Bhagavad Gita 15:18",
  },
  {
    text: "Whoever knows Me as the Supreme Personality of Godhead, without doubting, is the knower of everything. He therefore engages himself in full devotional service to Me.",
    ref: "Bhagavad Gita 15:19",
  },
  {
    text: "This is the most confidential part of the Vedic scriptures, O sinless one, and it is disclosed now by Me. Whoever understands this will become wise, and his endeavors will know perfection.",
    ref: "Bhagavad Gita 15:20",
  },

  // Chapter 16 — Daivasura-Sampad-Vibhaga Yoga
  {
    text: "Fearlessness, purification of one's existence, cultivation of spiritual knowledge, charity, self-control, performance of sacrifice, study of the Vedas, austerity and simplicity — these are the transcendental qualities of the godly men.",
    ref: "Bhagavad Gita 16:1",
  },
  {
    text: "Nonviolence, truthfulness, freedom from anger, renunciation, tranquility, aversion to faultfinding, compassion and freedom from covetousness, gentleness, modesty and steady determination — these further qualities I declare.",
    ref: "Bhagavad Gita 16:2",
  },
  {
    text: "Pride, arrogance, conceit, anger, harshness and ignorance — these qualities belong to those of demonic nature.",
    ref: "Bhagavad Gita 16:4",
  },
  {
    text: "The divine qualities are conducive to liberation, whereas the demonic qualities make for bondage. Do not worry, O son of Pandu, for you are born with the divine qualities.",
    ref: "Bhagavad Gita 16:5",
  },
  {
    text: "Lust, anger, and greed are the three gates to self-destructive hell. Every sane man should give these up, for they lead to the degradation of the soul.",
    ref: "Bhagavad Gita 16:21",
  },
  {
    text: "He who has discarded the scriptural injunctions and acts according to his own whims attains neither perfection, nor happiness, nor the supreme destination.",
    ref: "Bhagavad Gita 16:23",
  },

  // Chapter 17 — Sraddhatraya-Vibhaga Yoga
  {
    text: "The faith of each is in accordance with one's own nature. Man is made of his faith; as his faith is, so he is.",
    ref: "Bhagavad Gita 17:3",
  },
  {
    text: "Those who are situated in the mode of goodness worship the demigods; those who are in the mode of passion worship the demons; and those who are in the mode of ignorance worship ghosts and spirits.",
    ref: "Bhagavad Gita 17:4",
  },
  {
    text: "Austerity of speech consists in speaking words that are truthful, pleasing, beneficial, and not agitating to others, and also in regularly reciting Vedic literature.",
    ref: "Bhagavad Gita 17:15",
  },
  {
    text: "Cleanliness, simplicity, celibacy and nonviolence — these are the austerities of the body.",
    ref: "Bhagavad Gita 17:14",
  },
  {
    text: "Serenity, simplicity, gravity, self-control and purification of one's existence — these are the austerities of the mind.",
    ref: "Bhagavad Gita 17:16",
  },
  {
    text: "This threefold austerity, practiced by men whose aim is not to benefit themselves materially but to please the Supreme, is of the nature of goodness.",
    ref: "Bhagavad Gita 17:17",
  },
  {
    text: "Whatever is done without faith in God, whether it be sacrifice, charity, austerity, or any other act, is impermanent, O son of Prtha. It is called asat and is useless both in this life and the next.",
    ref: "Bhagavad Gita 17:28",
  },

  // Chapter 18 — Moksha-Sannyas Yoga
  {
    text: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reaction. Do not fear.",
    ref: "Bhagavad Gita 18:66",
  },
  {
    text: "Always think of Me, become My devotee, worship Me and offer your homage unto Me. Thus you will come to Me without fail. I promise you this because you are My very dear friend.",
    ref: "Bhagavad Gita 18:65",
  },
  {
    text: "One can understand Me as I am, as the Supreme Personality of Godhead, only by devotional service. And when one is in full consciousness of Me by such devotion, he can enter into the kingdom of God.",
    ref: "Bhagavad Gita 18:55",
  },
  {
    text: "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, equal in both happiness and distress, who is tolerant — such a devotee is very dear to Me.",
    ref: "Bhagavad Gita 12:13",
  },
  {
    text: "If you become conscious of Me, you will pass over all the obstacles of conditioned life by My grace. If, however, you do not work in such consciousness but act through false ego, not hearing Me, you will be lost.",
    ref: "Bhagavad Gita 18:58",
  },
  {
    text: "Wherever there is Krishna, the master of all mystics, and wherever there is Arjuna, the supreme archer, there will also certainly be opulence, victory, extraordinary power, and morality. That is my opinion.",
    ref: "Bhagavad Gita 18:78",
  },
  {
    text: "The Supreme Lord is situated in everyone's heart, O Arjuna, and is directing the wanderings of all living entities, who are seated as on a machine, made of the material energy.",
    ref: "Bhagavad Gita 18:61",
  },
  {
    text: "Thus I have explained to you knowledge still more confidential. Deliberate on this fully, and then do what you wish to do.",
    ref: "Bhagavad Gita 18:63",
  },
  {
    text: "This is the most confidential of all knowledge. Think over it carefully, then act as you see fit.",
    ref: "Bhagavad Gita 18:63",
  },
  {
    text: "For one who explains this supreme secret to the devotees, pure devotional service is guaranteed, and at the end he will come back to Me.",
    ref: "Bhagavad Gita 18:68",
  },
  {
    text: "There is no servant in this world more dear to Me than he, nor will there ever be one more dear.",
    ref: "Bhagavad Gita 18:69",
  },
  {
    text: "And I declare that he who studies this sacred conversation of ours worships Me by his intelligence.",
    ref: "Bhagavad Gita 18:70",
  },

  // Additional Chapter 2 quotes
  {
    text: "The self-controlled soul, who moves among sense objects, free from either attachment or repulsion, he wins eternal Peace.",
    ref: "Bhagavad Gita 2:64",
  },
  {
    text: "The person who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind.",
    ref: "Bhagavad Gita 2:56",
  },
  {
    text: "When a man dwells on the pleasures of sense, attraction for them arises in him. From attraction arises desire, the lust of possession, and this leads to passion, to anger.",
    ref: "Bhagavad Gita 2:62",
  },
  {
    text: "From anger, complete delusion arises, and from delusion bewilderment of memory. When memory is bewildered, intelligence is lost, and when intelligence is lost one falls down again into the material pool.",
    ref: "Bhagavad Gita 2:63",
  },
  {
    text: "As the ocean remains unmoved though waters flow into it from all sides, so the undisturbed sage remains motionless though desires surge about him. Such a one attains peace; not he who hungers after the objects of desire.",
    ref: "Bhagavad Gita 2:70",
  },
  {
    text: "One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind.",
    ref: "Bhagavad Gita 2:56",
  },
  {
    text: "Change is the law of the universe. You can be a millionaire, or a pauper in an instant. What you think of as death is indeed life, and what you think of as life is indeed death.",
    ref: "Bhagavad Gita 2:17",
  },
  {
    text: "Curb your senses and actions and concentrate your mind on Me. Regulate your breathing. Thus you will conquer the senses. Your action will be undivided and directed towards Me.",
    ref: "Bhagavad Gita 5:27",
  },

  // Additional quotes from various chapters
  {
    text: "This whole world is pervaded by Me in My unmanifest form. All beings are in Me, but I am not in them.",
    ref: "Bhagavad Gita 9:4",
  },
  {
    text: "And yet everything that is created does not rest in Me. Behold My mystic opulence! Although I am the maintainer of all living entities and although I am everywhere, I am not a part of this cosmic manifestation, for My Self is the very source of creation.",
    ref: "Bhagavad Gita 9:5",
  },
  {
    text: "At the end of the millennium every material manifestation enters into My nature, and at the beginning of another millennium, by My potency, I create again.",
    ref: "Bhagavad Gita 9:7",
  },
  {
    text: "All this work cannot bind Me. I am ever detached from all these actions, sitting as one unconcerned.",
    ref: "Bhagavad Gita 9:9",
  },
  {
    text: "Under My supervision, nature gives birth to all things, moving and nonmoving. For this reason, O son of Kunti, the world revolves.",
    ref: "Bhagavad Gita 9:10",
  },
  {
    text: "Fools deride Me when I descend in the human form. They do not know My transcendental nature as the Supreme Lord of all that be.",
    ref: "Bhagavad Gita 9:11",
  },
  {
    text: "Those who are deluded by that nature are engaged in futile hopes, futile actions, and futile knowledge. They are bereft of all discrimination and are thoroughly demonic.",
    ref: "Bhagavad Gita 9:12",
  },
  {
    text: "O son of Prtha, those who take shelter in Me, though they be of lower birth — women, vaisyas [merchants] as well as sudras [workers] — can attain the supreme destination.",
    ref: "Bhagavad Gita 9:32",
  },
  {
    text: "How much more this is so of the righteous Brahmanas, the devotees, and the saintly kings. Therefore, having come to this temporary, miserable world, engage in loving service unto Me.",
    ref: "Bhagavad Gita 9:33",
  },
  {
    text: "Engage your mind always in thinking of Me, become My devotee, offer obeisances to Me and worship Me. Being completely absorbed in Me, surely you will come to Me.",
    ref: "Bhagavad Gita 9:34",
  },

  // Karma Yoga extras
  {
    text: "There is nothing lost or wasted in this life. There is no religion equal to righteousness. There is no sin like covetousness.",
    ref: "Bhagavad Gita 2:40",
  },
  {
    text: "In this endeavour there is no loss or diminution, and a little advancement on this path can protect one from the most dangerous type of fear.",
    ref: "Bhagavad Gita 2:40",
  },
  {
    text: "Those who are on this path are resolute in purpose, and their aim is one. O beloved child of the Kurus, the intelligence of those who are irresolute is many-branched.",
    ref: "Bhagavad Gita 2:41",
  },
  {
    text: "O Partha, how can a person who knows that the spirit is indestructible and eternal, who knows that this individual spirit is unborn and immutable — how can that person slay anyone or cause anyone to slay?",
    ref: "Bhagavad Gita 2:21",
  },
  {
    text: "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.",
    ref: "Bhagavad Gita 2:22",
  },
  {
    text: "This indestructible soul cannot be slashed by weapons, nor burned by fire, nor dried by wind, nor wetted by water.",
    ref: "Bhagavad Gita 2:23",
  },
  {
    text: "This individual soul is unbreakable and insoluble, and can be neither burned nor dried. It is everlasting, all pervading, unchangeable, immovable, and eternally the same.",
    ref: "Bhagavad Gita 2:24",
  },
  {
    text: "It is said that the soul is invisible, inconceivable and immutable. Knowing this, you should not grieve for the body.",
    ref: "Bhagavad Gita 2:25",
  },
  {
    text: "If, however, you think that the soul is perpetually born and always dies, still you have no reason to lament, O mighty-armed.",
    ref: "Bhagavad Gita 2:26",
  },
  {
    text: "One who has taken his birth is sure to die, and after death one is sure to take birth again. Therefore, in the unavoidable discharge of your duty, you should not lament.",
    ref: "Bhagavad Gita 2:27",
  },

  // Chapter 3 extras
  {
    text: "Perform your obligatory duty, because action is indeed better than inaction. Even the maintenance of your body would not be possible through inaction.",
    ref: "Bhagavad Gita 3:8",
  },
  {
    text: "All living beings subsist on food, and food is produced by rain. Rain is produced by the performance of yajna [sacrifice], and yajna is born of prescribed duties.",
    ref: "Bhagavad Gita 3:14",
  },
  {
    text: "In the beginning of creation, the Lord of all creatures sent forth generations of men and demigods, along with sacrifices for Vishnu, and blessed them by saying, 'Be thou happy by this yajna.'",
    ref: "Bhagavad Gita 3:10",
  },
  {
    text: "The demigods, being satisfied by the performance of sacrifice, will also please you; and thus, by cooperation between men and demigods, prosperity will reign for all.",
    ref: "Bhagavad Gita 3:11",
  },
  {
    text: "In charge of the various necessities of life, the demigods, being satisfied by the performance of yajna, will supply all necessities to you. But he who enjoys such gifts without offering them to the demigods in return is certainly a thief.",
    ref: "Bhagavad Gita 3:12",
  },
  {
    text: "There is no work that affects Me; nor do I aspire for the fruits of action. One who understands this truth about Me also does not become entangled in the fruitive reactions of work.",
    ref: "Bhagavad Gita 4:14",
  },
  {
    text: "Even if you are considered to be the most sinful of all sinners, when you are situated in the boat of transcendental knowledge, you will be able to cross over the ocean of miseries.",
    ref: "Bhagavad Gita 4:36",
  },

  // Chapter 5 extras
  {
    text: "One who is equal to friends and enemies, who is equipoised in honor and dishonor, heat and cold, happiness and distress — is very dear to Me.",
    ref: "Bhagavad Gita 12:18",
  },
  {
    text: "The sage who knows the self, who is not bound by work, who is beyond purity and impurity — such a sage brings peace to all.",
    ref: "Bhagavad Gita 5:19",
  },
  {
    text: "Those who are free from anger and all material desires, who are self-realized, self-disciplined and constantly endeavoring for perfection, are assured of liberation in the Supreme in the very near future.",
    ref: "Bhagavad Gita 5:26",
  },
  {
    text: "Shutting out all external sense objects, keeping the eyes and vision concentrated between the two eyebrows, suspending the inward and outward breaths within the nostrils, and thus controlling the mind, senses and intelligence, the transcendentalist aims for liberation.",
    ref: "Bhagavad Gita 5:27",
  },
  {
    text: "A person who neither rejoices upon achieving something pleasant nor laments upon obtaining something unpleasant, who is self-intelligent, who is unbewildered, and who knows the science of God, is already situated in transcendence.",
    ref: "Bhagavad Gita 5:20",
  },

  // Chapter 6 extras
  {
    text: "For one who has conquered the mind, the Supersoul is already reached, for he has attained tranquility. To such a man happiness and distress, heat and cold, honor and dishonor are all the same.",
    ref: "Bhagavad Gita 6:7",
  },
  {
    text: "A person is said to be established in self-realization and is called a yogi when he is fully satisfied by virtue of acquired knowledge and realization. Such a person is situated in transcendence and is self-controlled.",
    ref: "Bhagavad Gita 6:8",
  },
  {
    text: "The yogi is greater than the body disciplinarian, greater than the empiricist and greater than the fruitive worker. Therefore, O Arjuna, in all circumstances, be a yogi.",
    ref: "Bhagavad Gita 6:46",
  },
  {
    text: "And of all yogis, the one with great faith who always abides in Me, thinks of Me within himself, and renders transcendental loving service to Me — he is the most intimately united with Me in yoga and is the highest of all.",
    ref: "Bhagavad Gita 6:47",
  },
  {
    text: "One who sees inaction in action and action in inaction is intelligent among men, and he is in the transcendental position, although engaged in all sorts of activities.",
    ref: "Bhagavad Gita 4:18",
  },
  {
    text: "By detachment from fruits of work, the yogi attains perfect peace; but the non-yogi, attached to fruits of his work, is in bondage.",
    ref: "Bhagavad Gita 5:12",
  },
  {
    text: "The yogi who, comparing himself with others, sees the same soul everywhere and the same pain and pleasure in all, O Arjuna, is considered the highest yogi.",
    ref: "Bhagavad Gita 6:32",
  },

  // Chapter 7 extras
  {
    text: "After many births and deaths, he who is actually in knowledge surrenders unto Me, knowing Me to be the cause of all causes and all that is. Such a great soul is very rare.",
    ref: "Bhagavad Gita 7:19",
  },
  {
    text: "Those whose intelligence has been stolen by material desires surrender unto demigods and follow the particular rules and regulations of worship according to their own natures.",
    ref: "Bhagavad Gita 7:20",
  },
  {
    text: "I am in everyone's heart as the Supersoul. As soon as one desires to worship some demigod, I make his faith steady so that he can devote himself to that particular deity.",
    ref: "Bhagavad Gita 7:21",
  },
  {
    text: "Endowed with such a faith, he seeks favors of a particular demigod and obtains his desires. But in actuality these benefits are bestowed by Me alone.",
    ref: "Bhagavad Gita 7:22",
  },
  {
    text: "Men of small intelligence worship the demigods, and their fruits are limited and temporary. Those who worship the demigods go to the planets of the demigods, but My devotees ultimately reach My supreme planet.",
    ref: "Bhagavad Gita 7:23",
  },
  {
    text: "Unintelligent men, who do not know Me perfectly, think that I, the Supreme Personality of Godhead, Krishna, was impersonal before and have now assumed this personality.",
    ref: "Bhagavad Gita 7:24",
  },
  {
    text: "O conqueror of sleep, those who know Me as the Supreme Lord, as the governing principle, as the basis of all sacrifice, can, with steadied mind, know and understand Me even at the time of death.",
    ref: "Bhagavad Gita 7:30",
  },

  // Brahman / Self-knowledge quotes
  {
    text: "The Brahman is the individual self's source and its return. Who knows Brahman is Brahman.",
    ref: "Bhagavad Gita 4:24",
  },
  {
    text: "You are entitled to action, not to its fruits.",
    ref: "Bhagavad Gita 3:26",
  },
  {
    text: "Those who are deluded by the ego think: 'I am the doer.' In truth it is the nature's three qualities that perform all actions.",
    ref: "Bhagavad Gita 3:27",
  },
  {
    text: "One who knows the truth about the three modes of material nature and their respective influences knows that the modes act and react upon each other; knowing this, one does not think himself to be the doer.",
    ref: "Bhagavad Gita 3:28",
  },
  {
    text: "The soul who is not moved by anything, who faces good and evil with equanimity, neither glad nor grieving — that soul has transcended all.",
    ref: "Bhagavad Gita 2:57",
  },
  {
    text: "That one I love who is incapable of ill will, who is friendly and compassionate, living beyond the reach of I and mine, and of pain and pleasure, full of patience.",
    ref: "Bhagavad Gita 12:13",
  },
  {
    text: "Unattached to any fruit of action, needing nothing, always doing, doing nothing — thus do I move in the world.",
    ref: "Bhagavad Gita 3:22",
  },

  // Bhakti / Devotion
  {
    text: "Engage your mind always in thinking of Me, become My devotee, offer obeisances to Me and worship Me. Being completely absorbed in Me, surely you will come to Me.",
    ref: "Bhagavad Gita 9:34",
  },
  {
    text: "By Me, in My unmanifested form, this entire universe is pervaded. All beings are in Me, but I am not in them.",
    ref: "Bhagavad Gita 9:4",
  },
  {
    text: "He who sees Me everywhere and sees everything in Me — I am not lost to him, nor is he ever lost to Me.",
    ref: "Bhagavad Gita 6:30",
  },
  {
    text: "For those who worship Me with devotion, meditating on My transcendental form — I carry what they lack, and I preserve what they have.",
    ref: "Bhagavad Gita 9:22",
  },
  {
    text: "Even the most sinful of sinners, O Arjuna, will cross over the ocean of sinfulness by the boat of transcendental knowledge.",
    ref: "Bhagavad Gita 4:36",
  },
  {
    text: "By becoming fixed in this knowledge one can attain to the transcendental nature like My own. Thus established, one is not born at the time of creation or disturbed at the time of dissolution.",
    ref: "Bhagavad Gita 14:2",
  },
  {
    text: "This knowledge is the king of education, the most secret of all secrets. It is the purest knowledge, and because it gives direct perception of the self by realization, it is the perfection of religion. It is everlasting, and it is joyfully performed.",
    ref: "Bhagavad Gita 9:2",
  },

  // Equanimity / Peace
  {
    text: "Let a man lift himself by his own self alone, let him not lower himself; for this self alone is the friend of oneself and this self alone is the enemy of oneself.",
    ref: "Bhagavad Gita 6:5",
  },
  {
    text: "He who is temperate in his habits of eating, sleeping, working and recreation can mitigate all material pains by practicing the yoga system.",
    ref: "Bhagavad Gita 6:17",
  },
  {
    text: "When the yogi, by practice of yoga, disciplines his mental activities and becomes situated in transcendence — devoid of all material desires — he is said to be well established in yoga and is called a yogi.",
    ref: "Bhagavad Gita 6:18",
  },
  {
    text: "The stage of perfection is called trance, or samadhi, when one's mind is completely restrained from material mental activities by practice of yoga.",
    ref: "Bhagavad Gita 6:20",
  },
  {
    text: "In that joyous state, one is situated in boundless transcendental happiness, realized through transcendental senses. Established thus, one never departs from the truth.",
    ref: "Bhagavad Gita 6:21",
  },
  {
    text: "Upon gaining this he thinks there is no greater gain. Being situated in such a position, one is never shaken, even in the midst of greatest difficulty.",
    ref: "Bhagavad Gita 6:22",
  },
  {
    text: "This is the real meaning of yoga — a deliverance from contact with pain and sorrow. One should practice this yoga with determination and with a heart not downcast.",
    ref: "Bhagavad Gita 6:23",
  },
  {
    text: "Abandoning without exception all the desires born of volition, and completely restraining all the senses from all sides by the mind alone, one should little by little attain tranquillity.",
    ref: "Bhagavad Gita 6:24",
  },
  {
    text: "With the intelligence held firm, with the mind established in the self, he should think of nothing whatsoever. Gradually, little by little, let him attain quiescence. Let his mind be fixed on the self.",
    ref: "Bhagavad Gita 6:25",
  },
  {
    text: "From whatever cause the restless and unsteady mind wanders away, he should restrain it and bring it back under the control of the self alone.",
    ref: "Bhagavad Gita 6:26",
  },
  {
    text: "Supreme happiness comes to the yogi whose mind is peaceful, whose passions are calmed, who is without sin and who has become one with Brahman.",
    ref: "Bhagavad Gita 6:27",
  },
  {
    text: "Freed from sin, the yogi constantly engages himself in yoga and easily attains the infinite bliss of contact with Brahman.",
    ref: "Bhagavad Gita 6:28",
  },

  // Misc important shlokas
  {
    text: "The Lord said: O Arjuna, there is no truth superior to Me. Everything rests upon Me, as pearls are strung on a thread.",
    ref: "Bhagavad Gita 7:7",
  },
  {
    text: "I am the seed of all existence, O Arjuna. There is no being, moving or nonmoving, that can exist without Me.",
    ref: "Bhagavad Gita 10:39",
  },
  {
    text: "I am the goal of the wise man, and I am the way. I am his wealth and his refuge. I am his origin, I am his last end.",
    ref: "Bhagavad Gita 9:18",
  },
  {
    text: "I am the sustaining essence of everything, and I am the eternal seed. I am the intelligence of the intelligent; the splendor of the splendid.",
    ref: "Bhagavad Gita 7:10",
  },
  {
    text: "Among purifiers, I am the wind; of the warriors, I am Rama; among the fishes I am the shark, and of flowing rivers I am the Ganges.",
    ref: "Bhagavad Gita 10:31",
  },
  {
    text: "Among all the creations I am the beginning and the end and also the middle, O Arjuna. Of all sciences I am the spiritual science of the Self, and among logicians I am the conclusive truth.",
    ref: "Bhagavad Gita 10:32",
  },
  {
    text: "Of letters I am the letter A, and among compound words I am the dual compound. I am also inexhaustible time, and of creators I am Brahma.",
    ref: "Bhagavad Gita 10:33",
  },
  {
    text: "I am all-devouring death, and I am the generating principle of all that is yet to be. Among women I am fame, fortune, fine speech, memory, intelligence, steadfastness and patience.",
    ref: "Bhagavad Gita 10:34",
  },

  // Final chapter 18 extras
  {
    text: "Always think of Me, become My devotee, worship Me and offer your homage unto Me. Thus you will come to Me without fail.",
    ref: "Bhagavad Gita 18:65",
  },
  {
    text: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reaction. Do not fear.",
    ref: "Bhagavad Gita 18:66",
  },
  {
    text: "This confidential knowledge may never be explained to those who are not austere, or devoted, or engaged in devotional service, nor to one who is envious of Me.",
    ref: "Bhagavad Gita 18:67",
  },
  {
    text: "For one who explains this supreme secret to the devotees, pure devotional service is guaranteed, and at the end he will come back to Me.",
    ref: "Bhagavad Gita 18:68",
  },
  {
    text: "It is My opinion that there is no servant in this world more dear to Me than he, nor will there ever be one more dear.",
    ref: "Bhagavad Gita 18:69",
  },
  {
    text: "O Arjuna, have you heard this with an attentive mind? And are your ignorance and illusions now dispelled?",
    ref: "Bhagavad Gita 18:72",
  },
  {
    text: "Arjuna said: My dear Krishna, O infallible one, my illusion is now gone. I have regained my memory by Your mercy. I am now firm and free from doubt and am prepared to act according to Your instructions.",
    ref: "Bhagavad Gita 18:73",
  },

  // Wisdom / Knowledge
  {
    text: "The wisdom-sacrifice is superior to any material sacrifice, for, O Paramtapa, all action without exception culminates in wisdom.",
    ref: "Bhagavad Gita 4:33",
  },
  {
    text: "Even the most wise are bewildered in defining what is action and what is inaction. I shall explain to you the mystery of action, by knowing which you shall be liberated from its evil.",
    ref: "Bhagavad Gita 4:16",
  },
  {
    text: "He who performs his duty without attachment, surrendering the results unto the Supreme Lord, is unaffected by sinful action, as the lotus leaf is untouched by water.",
    ref: "Bhagavad Gita 5:10",
  },
  {
    text: "A transcendentalist should always engage his body, mind and self in relationship with the Supreme; he should live alone and should carefully control his mind. He should always be free from desires and feelings of possessiveness.",
    ref: "Bhagavad Gita 6:10",
  },
  {
    text: "To practice yoga, one should go to a secluded place and should lay kusa grass on the ground and then cover it with a deerskin and a soft cloth. The seat should be neither too high nor too low and should be situated in a sacred place.",
    ref: "Bhagavad Gita 6:11",
  },
  {
    text: "Being free from all sexual desire, fear and anger, one fixed in this holy state, with Me as the supreme goal, should practice concentration.",
    ref: "Bhagavad Gita 6:14",
  },
  {
    text: "Thus practicing control of the body, mind and activities, the mystic transcendentalist, his mind regulated, attains to the kingdom of God by cessation of material existence.",
    ref: "Bhagavad Gita 6:15",
  },
  {
    text: "There is no possibility of one's becoming a yogi, O Arjuna, if one eats too much or eats too little, sleeps too much or does not sleep enough.",
    ref: "Bhagavad Gita 6:16",
  },

  // Surrender and trust
  {
    text: "Let your acts of sacrifice be acts of utmost giving. Let the offering be your own actions, and seek no reward. This is the true spirit of sacrifice.",
    ref: "Bhagavad Gita 4:28",
  },
  {
    text: "Steady in the Lord, freed of all desires, having cast off attachment and dread of pain, they attain the purified state.",
    ref: "Bhagavad Gita 2:56",
  },
  {
    text: "A person who is satisfied in the self alone, who is free from these attachments, who looks upon the pleasure of attachment with indifference — that person is truly wise.",
    ref: "Bhagavad Gita 2:55",
  },
  {
    text: "Just as a person acts, so does he become. One becomes virtuous by virtuous action, bad by bad action.",
    ref: "Bhagavad Gita 4:17",
  },
  {
    text: "Yoga is not for the man who overeats or oversleeps, nor for him who sleeps too little or eats too little. It is for him whose habits of sleep and waking, eating and playing are regulated.",
    ref: "Bhagavad Gita 6:16",
  },
  {
    text: "When the senses are still, when the mind is at rest, when the intellect wavers not — that is called the highest state by the wise.",
    ref: "Bhagavad Gita 6:20",
  },
  {
    text: "This is the Brahmic splendor! This is freedom! This is yoga! This is the supreme! The yogi ever dwells in bliss. He knows no decay.",
    ref: "Bhagavad Gita 6:27",
  },

  // More Chapter 1
  {
    text: "Arjuna said: O infallible one, please draw my chariot between the two armies so that I may see those present here, who desire to fight, and with whom I must contend in this great trial of arms.",
    ref: "Bhagavad Gita 1:21",
  },
  {
    text: "My limbs fail and my mouth is parched, my body quivers and my hair stands on end. My bow slips from my hand, and my skin burns all over; I am unable to stand, and it seems to me that my mind is whirling.",
    ref: "Bhagavad Gita 1:29",
  },

  // Deeper karma quotes
  {
    text: "Those who are beyond the dualities that arise from doubts, whose minds are engaged within, who are always busy working for the welfare of all living beings and who are free from all sins achieve liberation in the Supreme.",
    ref: "Bhagavad Gita 5:25",
  },
  {
    text: "Perform all thy actions with mind concentrated on the Divine, renouncing attachment and looking upon success and failure with an equal eye. Spirituality implies equanimity.",
    ref: "Bhagavad Gita 2:48",
  },

  // Peace and liberation
  {
    text: "Peace cannot be achieved through partial understanding. Only complete surrender and total dedication to the Divine yields the highest peace.",
    ref: "Bhagavad Gita 2:66",
  },
  {
    text: "When a man is without craving in all his thoughts, through self-mastery, he finds peace.",
    ref: "Bhagavad Gita 2:71",
  },
  {
    text: "The peace of God is with them whose mind and soul are in harmony, who are free from desire and wrath, who know their own soul.",
    ref: "Bhagavad Gita 5:26",
  },

  // Misc remaining
  {
    text: "Seek ye first the Kingdom of Heaven within, then everything else shall be added unto you. Fix your gaze on the eternal self, and live in peace.",
    ref: "Bhagavad Gita 6:22",
  },
  {
    text: "What is action and what is inaction? Even the wise are confused about this. Therefore I shall explain to you what action is, by knowing which you will be liberated from all misfortune.",
    ref: "Bhagavad Gita 4:16",
  },
  {
    text: "The action, which is right, which is obligatory, done without attachment, without love or hatred, by one who is not desirous of fruit — is called sattvic.",
    ref: "Bhagavad Gita 18:23",
  },
  {
    text: "But that action which is performed with great effort by one seeking to gratify his desires, and enacted from a sense of false ego — is called rajasic.",
    ref: "Bhagavad Gita 18:24",
  },
  {
    text: "That action performed in illusion, without consideration of future bondage or consequences, which causes injury and is impractical — is declared to be in the mode of ignorance.",
    ref: "Bhagavad Gita 18:25",
  },
  {
    text: "One who performs his duty without association with the modes of material nature, without false ego, with great determination and enthusiasm, and without wavering in success or failure is said to be a worker in the mode of goodness.",
    ref: "Bhagavad Gita 18:26",
  },
  {
    text: "The worker who is free from all material attachments and false ego, who is enthusiastic and resolute and who is indifferent to success or failure, is a worker in goodness.",
    ref: "Bhagavad Gita 18:26",
  },
  {
    text: "But the worker who is attached to the work and the fruits of work, desiring to enjoy those fruits, and who is greedy, always envious, impure, and moved by joy and sorrow, is said to be in the mode of passion.",
    ref: "Bhagavad Gita 18:27",
  },
  {
    text: "The worker who is always engaged in work against the injunctions of the scripture, who is materialistic, obstinate, cheating and expert in insulting others, and who is lazy, always morose and procrastinating is said to be a worker in the mode of ignorance.",
    ref: "Bhagavad Gita 18:28",
  },
  {
    text: "O winner of wealth, now please listen as I tell you in detail of the different kinds of understanding and determination, according to the three modes of material nature.",
    ref: "Bhagavad Gita 18:29",
  },
  {
    text: "O son of Prtha, that understanding by which one knows what ought to be done and what ought not to be done, what is to be feared and what is not to be feared, what is binding and what is liberating, is in the mode of goodness.",
    ref: "Bhagavad Gita 18:30",
  },
  {
    text: "O son of Prtha, that understanding which cannot distinguish between religion and irreligion, between action that should be done and action that should not be done — that imperfect understanding is in the mode of passion.",
    ref: "Bhagavad Gita 18:31",
  },
  {
    text: "That understanding which considers irreligion to be religion and religion to be irreligion, under the spell of illusion and darkness, and strives always in the wrong direction, O Partha, is in the mode of ignorance.",
    ref: "Bhagavad Gita 18:32",
  },
  {
    text: "O best of the Bharatas, that determination which is unbreakable, which is sustained with steadfastness by yoga practice, and which thus controls the activities of the mind, life and senses is determination in the mode of goodness.",
    ref: "Bhagavad Gita 18:33",
  },
  {
    text: "But that determination by which one holds fast to fruitive results in religion, economic development and sense gratification is of the nature of passion, O Arjuna.",
    ref: "Bhagavad Gita 18:34",
  },
  {
    text: "And that determination which cannot go beyond dreaming, fearfulness, lamentation, moroseness and illusion — such unintelligent determination, O son of Prtha, is in the mode of darkness.",
    ref: "Bhagavad Gita 18:35",
  },
  {
    text: "O best of the Bharatas, now please hear from Me about the three kinds of happiness by which the conditioned soul enjoys, and by which he sometimes comes to the end of all distress.",
    ref: "Bhagavad Gita 18:36",
  },
  {
    text: "That which in the beginning may be just like poison but at the end is just like nectar and which awakens one to self-realization is said to be happiness in the mode of goodness.",
    ref: "Bhagavad Gita 18:37",
  },
  {
    text: "That happiness which is derived from contact of the senses with their objects and which appears like nectar at first but poison at the end is said to be of the nature of passion.",
    ref: "Bhagavad Gita 18:38",
  },
  {
    text: "And that happiness which is blind to self-realization, which is delusion from beginning to end and which arises from sleep, laziness and illusion is said to be of the nature of ignorance.",
    ref: "Bhagavad Gita 18:39",
  },
  {
    text: "There is no being existing, either here or among the demigods in the higher planetary systems, which is freed from these three modes born of material nature.",
    ref: "Bhagavad Gita 18:40",
  },
  {
    text: "Brahmanas, ksatriyas, vaisyas and sudras are distinguished by the qualities born of their own natures in accordance with the material modes, O chastiser of the enemy.",
    ref: "Bhagavad Gita 18:41",
  },
];

/**
 * Returns the quote for today based on the day of the year.
 * Day 1 (Jan 1) → index 0, Day 365 (Dec 31) → index 364.
 */
export function getTodaysQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay); // 1–365
  const index = (dayOfYear - 1) % gitaQuotes.length;
  return gitaQuotes[index];
}

export default gitaQuotes;
