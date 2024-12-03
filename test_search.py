import thefuzz.process

x = [
    ("alice", "Alison Henderson"),
    ("abby", "Abby Johnson"),
    ("abi", "Abigail Smith"),
    ("bob", "Robert Smith"),
    ("bobby", "Bob Brown"),
    ("charlie", "Charlie Brown"),
    ("david", "David Smith"),
    ("edward", "Edward Johnson"),
    ("frank", "Frank Wilson"),
    ("george", "George Wright"),
    ("harry", "Harry Thompson"),
    ("isabel", "Isabel Garcia"),
    ("issac", "Issac Robinson"),
    ("jane", "Jane Martinez"),
    ("kate", "Kate Anderson"),
    ("larry", "Larry Thomas"),
    ("michael", "Michael Baker"),
    ("nancy", "Nancy Lee"),
    ("oliver", "Oliver Davis"),
    ("peter", "Peter Young"),
    ("quincy", "Quincy Scott"),
    ("robert", "Robert Hall"),
    ("sarah", "Sarah Allen"),
    ("thomas", "Thomas King"),
    ("ursula", "Ursula Green"),
    ("victor", "Victor Baker"),
    ("william", "William Harris"),
    ("xavier", "Xavier Baker"),
    ("yvonne", "Yvonne Baker"),
    ("zachary", "Zachary Baker"),
]

while True:
    print(thefuzz.process.extract(input(">"), x, limit=None))
