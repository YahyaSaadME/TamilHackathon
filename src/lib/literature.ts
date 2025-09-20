export interface LiteratureWork {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  content: string;
  summary: string;
  themes: string[];
}

export const literatureDatabase: LiteratureWork[] = [
  {
    id: "pride-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    year: 1813,
    content: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.

However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.

"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"

Mr. Bennet replied that he had not.

"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."

Mr. Bennet made no answer.

"Do you not want to know who has taken it?" cried his wife impatiently.

"You want to tell me, and I have no objection to hearing it."

This was invitation enough.

"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week."`,
    summary: "A romantic novel about Elizabeth Bennet and Mr. Darcy, exploring themes of love, social class, and personal growth in Regency-era England.",
    themes: ["Love", "Social Class", "Pride", "Prejudice", "Marriage", "Family", "Society"]
  },
  {
    id: "to-kill-mockingbird",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    year: 1960,
    content: `When I was almost six and Jem was nearly ten, our summertime boundaries (within calling distance of Calpurnia) were Mrs. Henry Lafayette Dubose's house two doors to the north of us, and the Radley Place three doors to the south. We were never tempted to break them. The Radley Place was inhabited by an unknown entity the mere description of whom was enough to make us behave for days on end; Mrs. Dubose was plain hell.

That was the summer Dill came to us.

Early one morning as we were beginning our day's play in the back yard, Jem and I heard something next door in Miss Rachel Haverford's collard patch. We went to the wire fence to see if there was a puppy—Miss Rachel's rat terrier was expecting—instead we found someone sitting looking at us. Sitting down, he wasn't much higher than the collards. We stared at him until he spoke:

"Hey."

"Hey yourself," said Jem pleasantly.

"I'm Charles Baker Harris," he said. "I can read."

"So what?" I said.

"I just thought you'd like to know I can read. You got anything needs readin' I can do it..."

"How old are you," asked Jem, "four-and-a-half?"

"Goin' on seven."

"Shoot no wonder, then," said Jem, depositing his initial opinion of Dill as a pocket Merlin.`,
    summary: "A coming-of-age story set in the American South, exploring racial injustice through the eyes of Scout Finch as her father defends a Black man falsely accused of rape.",
    themes: ["Racial Injustice", "Moral Courage", "Coming of Age", "Prejudice", "Innocence", "Social Inequality", "Justice"]
  },
  {
    id: "great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    year: 1925,
    content: `In my younger and more vulnerable years my father gave me some advice that I've carried with me ever since.

"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven't had the advantages that you've had."

He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores. The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men. Most of the big shore dinners in those days were attended by men who came from cities that have a personality all their own.

And, after boasting this way of my tolerance, I come to the admission that it has a limit. Conduct may be founded on the hard rock or the wet marshes, but after a certain point I don't care what it's founded on. When I came back from the East last autumn I felt that I wanted the world to be in uniform and at a sort of moral attention forever; I wanted no more riotous excursions with privileged glimpses into the human heart.`,
    summary: "A critique of the American Dream through the story of Jay Gatsby's pursuit of Daisy Buchanan in 1920s America, exploring themes of wealth, love, and moral decay.",
    themes: ["American Dream", "Wealth", "Love", "Moral Decay", "Social Class", "Idealism", "Corruption"]
  },
  {
    id: "1984",
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    year: 1949,
    content: `It was a bright cold day in April, and the clocks were striking thirteen.

Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.

The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features. Winston made for the stairs. It was no use trying the lift. Even at the best of times it was seldom working, and at present the electric current was cut off during daylight hours. It was part of the economy drive in preparation for Hate Week. The flat was seven flights up, and Winston, who was thirty-nine and had a varicose ulcer above his right ankle, went slowly, resting several times on the way. On each landing, opposite the lift-shaft, the poster with the enormous face gazed from the wall. It was one of those pictures which are so contrived that the eyes follow you about when you move. BIG BROTHER IS WATCHING YOU, the caption beneath it ran.`,
    summary: "A dystopian novel depicting a totalitarian society where the government controls every aspect of life, following Winston Smith's struggle against the oppressive regime.",
    themes: ["Totalitarianism", "Surveillance", "Freedom", "Truth", "Control", "Resistance", "Power"]
  },
  {
    id: "romeo-juliet",
    title: "Romeo and Juliet",
    author: "William Shakespeare",
    genre: "Tragedy",
    year: 1597,
    content: `Two households, both alike in dignity,
In fair Verona, where we lay our scene,
From ancient grudge break to new mutiny,
Where civil blood makes civil hands unclean.
From forth the fatal loins of these two foes
A pair of star-cross'd lovers take their life;
Whose misadventured piteous overthrows
Do with their death bury their parents' strife.
The fearful passage of their death-mark'd love,
And the continuance of their parents' rage,
Which, but their children's end, nought could remove,
Is now the two hours' traffic of our stage;
The which if you with patient ears attend,
What here shall miss, our toil shall strive to mend.

SAMPSON
Gregory, o' my word, we'll not carry coals.

GREGORY
No, for then we should be colliers.

SAMPSON
I mean, an we be in choler, we'll draw.

GREGORY
Ay, while you live, draw your neck out o' the collar.

SAMPSON
I strike quickly, being moved.

GREGORY
But thou art not quickly moved to strike.

SAMPSON
A pox on both your houses! They have made worms' meat of me: I have it, and soundly too: your houses!`,
    summary: "Shakespeare's tragic play about two young lovers whose deaths ultimately unite their feuding families in Verona.",
    themes: ["Love", "Fate", "Family Conflict", "Youth", "Death", "Passion", "Tragedy"]
  }
];

export function searchLiterature(query: string): LiteratureWork[] {
  if (!query.trim()) return literatureDatabase;
  
  const lowerQuery = query.toLowerCase();
  
  return literatureDatabase.filter(work => 
    work.title.toLowerCase().includes(lowerQuery) ||
    work.author.toLowerCase().includes(lowerQuery) ||
    work.genre.toLowerCase().includes(lowerQuery) ||
    work.summary.toLowerCase().includes(lowerQuery) ||
    work.content.toLowerCase().includes(lowerQuery) ||
    work.themes.some(theme => theme.toLowerCase().includes(lowerQuery))
  );
}

export function getLiteratureById(id: string): LiteratureWork | undefined {
  return literatureDatabase.find(work => work.id === id);
}