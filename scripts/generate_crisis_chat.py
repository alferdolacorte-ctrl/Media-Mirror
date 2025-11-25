import json
import random
from datetime import datetime, timedelta
import os

print("Script starting...")

# ---------------------------------
# CONFIG
# ---------------------------------

NUM_MESSAGES = 400
OUTPUT_PATH = "data/crisis_chat.json"

PARTICIPANTS = [
    "Lena",
    "Miguel",
    "Sara",
    "Omar",
    "Mom",
    "Neighbor_3A",
    "Ana",
    "Tarek",
    "Leo",
]

# Fake city fragments (you can localise these later)
NEIGHBORHOODS = [
    "Old Town",
    "Riverside",
    "North Station",
    "Hilltop",
    "Industrial Park",
]

STREETS = [
    "Alameda Ave",
    "Central Blvd",
    "River St",
    "Market St",
    "Station Road",
]

METRO_STOPS = [
    "Central Station",
    "Museum",
    "University",
    "North Station",
    "Riverside",
]

LANDMARKS = [
    "the bakery on Market",
    "the orange pharmacy",
    "the small park by the river",
    "the bus depot",
    "the playground behind the school",
]

APARTMENT_DETAILS = [
    "our building, 7th floor",
    "stairwell B, 3rd floor",
    "block C, courtyard side",
    "roof of our building",
    "garage level under our block",
]

# Crisis starts here (you can change this)
START_TIME = datetime(2024, 2, 24, 5, 17)


# ---------------------------------
# PHASES (compressed timeline)
# ---------------------------------

PHASES = [
    ("shock", 0, 24),
    ("negotiation", 24, 72),
    ("emotional", 72, 168),
    ("polyvocal", 168, 720),
    ("routine", 720, 2000),
]


def get_phase(hours_since_start: float) -> str:
    for name, h_start, h_end in PHASES:
        if h_start <= hours_since_start < h_end:
            return name
    return PHASES[-1][0]


# ---------------------------------
# CATEGORY CODES
# ---------------------------------

def choose_categories(phase: str):
    r = random.random()

    if phase == "shock":
        if r < 0.4:
            return ["SI"]
        elif r < 0.8:
            return ["SA"]
        elif r < 0.9:
            return ["SI", "SA"]
        else:
            return ["CC"]

    if phase == "negotiation":
        if r < 0.3:
            return ["SI"]
        elif r < 0.55:
            return ["SA"]
        elif r < 0.8:
            return ["CC"]
        elif r < 0.9:
            return ["SI", "CC"]
        else:
            return ["SA", "CC"]

    if phase == "emotional":
        if r < 0.2:
            return ["EM"]
        elif r < 0.4:
            return ["C"]
        elif r < 0.6:
            return ["MN"]
        elif r < 0.8:
            return ["C", "EM"]
        else:
            return ["C", "EM", "MN"]

    if phase == "polyvocal":
        if r < 0.15:
            return ["SI"]
        elif r < 0.3:
            return ["SA"]
        elif r < 0.45:
            return ["CC"]
        elif r < 0.6:
            return ["EM"]
        elif r < 0.75:
            return ["C", "EM"]
        elif r < 0.9:
            return ["C", "EM", "MN"]
        else:
            return ["SI", "SA", "EM"]

    if phase == "routine":
        if r < 0.2:
            return ["SI"]
        elif r < 0.35:
            return ["SA"]
        elif r < 0.5:
            return ["EM"]
        elif r < 0.7:
            return ["MN"]
        elif r < 0.9:
            return ["EM", "MN"]
        else:
            return ["C", "MN"]

    return ["SI"]


# ---------------------------------
# TEXT GENERATORS PER CATEGORY
# ---------------------------------

def random_neighborhood():
    return random.choice(NEIGHBORHOODS)

def random_street():
    return random.choice(STREETS)

def random_metro():
    return random.choice(METRO_STOPS)

def random_landmark():
    return random.choice(LANDMARKS)

def random_apartment():
    return random.choice(APARTMENT_DETAILS)


def gen_SI():
    patterns = [
        f"Anyone knows what happened near {random_street()}?",
        f"Any news from {random_neighborhood()}? My relatives live there.",
        f"Is the metro at {random_metro()} still running?",
        f"Did something hit close to {random_landmark()}?",
        f"Can someone update on {random_neighborhood()}? No signal here.",
    ]
    return random.choice(patterns)


def gen_SA():
    patterns = [
        f"{random_neighborhood()}, smoke rising.",
        f"{random_street()} – windows blown out.",
        f"{random_landmark()}, heavy damage.",
        f"Strike near {random_metro()} entrance.",
        f"{random_apartment()}, glass everywhere.",
    ]
    return random.choice(patterns)


def gen_CC():
    patterns = [
        "Please no exact troop positions here.",
        "Mods, maybe delete videos showing addresses.",
        "Try to blur faces if you post photos.",
        "Stop shouting at each other, we all see the same fear.",
        "If you share rumors, mark them as unverified.",
    ]
    return random.choice(patterns)


def gen_EM():
    patterns = [
        "I can’t stop shaking when I hear sirens.",
        "I’m so tired of being scared.",
        "My chest hurts every time my phone rings now.",
        "I feel like this street will never be calm again.",
        "I’m losing it. I just want our old life back.",
    ]
    return random.choice(patterns)


def gen_C():
    patterns = [
        "Stop saying everything is under control. It clearly isn’t.",
        "They had years to prevent this and did nothing.",
        "Our local officials disappeared the moment it got serious.",
        "Every statement they make sounds like a bad script.",
        "No one is responsible, apparently. Just us stuck here.",
    ]
    return random.choice(patterns)


def gen_MN():
    patterns = [
        "Remember when {street} was just traffic noise and kids on bikes?".format(street=random_street()),
        "This used to be the quiet part of town, now it’s all checkpoints.",
        "Last year we met at {landmark} for coffee. Now it’s rubble.".format(landmark=random_landmark()),
        "We started keeping shoes by the bed, just in case we have to run.",
        "Our building group chat used to be about lost packages, now it’s about who survived.",
    ]
    return random.choice(patterns)


def generate_text_for_categories(categories):
    parts = []

    if "SI" in categories:
        parts.append(gen_SI())
    if "SA" in categories:
        if len(categories) == 1:
            return gen_SA()
        else:
            parts.append(gen_SA())
    if "CC" in categories:
        parts.append(gen_CC())
    if "EM" in categories:
        parts.append(gen_EM())
    if "C" in categories:
        parts.append(gen_C())
    if "MN" in categories:
        parts.append(gen_MN())

    if len(parts) == 0:
        return "..."

    selected = parts[:2]
    return " ".join(selected)


# ---------------------------------
# MAIN GENERATOR
#
def generate_conversation(num_messages=NUM_MESSAGES):
    messages = []
    current_time = START_TIME

    for i in range(num_messages):
        delta_minutes = random.randint(1, 90)
        current_time += timedelta(minutes=delta_minutes)

        hours_since_start = (current_time - START_TIME).total_seconds() / 3600.0
        phase = get_phase(hours_since_start)

        author = random.choice(PARTICIPANTS)

        categories = choose_categories(phase)
        text = generate_text_for_categories(categories)

        ts = current_time.isoformat()
        user = author

        messages.append({
            "timestamp": ts,
            "user": user,
            "message": text
        })

    return messages


def save_conversation(messages):
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(messages)} messages to {OUTPUT_PATH}")


if __name__ == "__main__":
    convo = generate_conversation()
    save_conversation(convo)
