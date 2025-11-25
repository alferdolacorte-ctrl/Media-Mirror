import json
import random
from datetime import datetime, timedelta
import os

# ---------------------------------
# CONFIG
# ---------------------------------

NUM_MESSAGES = 1000
OUTPUT_PATH = "data/crisis_timeline.json"

PARTICIPANTS = [
    "Lena", "Miguel", "Sara", "Omar", "Mom",
    "Neighbor_3A", "Ana", "Tarek", "Leo",
]

STREETS = [
    "Alameda Ave", "Central Blvd", "River St",
    "Market St", "Station Road", "Old Bridge", "Forest Lane",
]

NEIGHBORHOODS = [
    "Old Town", "Riverside", "North Station",
    "Hilltop", "Industrial Park", "Lower City",
]

METRO = ["Central Station", "Museum", "University", "North Station", "Riverside"]

LANDMARKS = [
    "the bakery on Market",
    "the orange pharmacy",
    "the small park by the river",
    "the bus depot",
    "the playground behind the school",
]

APARTMENTS = [
    "our building, 7th floor",
    "stairwell B, 3rd floor",
    "block C, courtyard side",
    "roof of our building",
    "garage level under our block",
]

START_TIME = datetime(2024, 2, 24, 5, 17)

# ---------------------------------
# STAGE BOUNDS
# ---------------------------------

STAGE_BOUNDS = [
    ("shock", 0.00, 0.20),
    ("negotiation", 0.20, 0.35),
    ("polyvocal", 0.35, 0.60),
    ("emotional", 0.60, 0.85),
    ("routine", 0.85, 1.00),
]




def phase_for_index(i: int, total: int) -> str:
    ratio = i / max(1, total - 1)
    for phase, lo, hi in STAGE_BOUNDS:
        if lo <= ratio < hi:
            return phase
    return STAGE_BOUNDS[-1][0]




# ---------------------------------
# REALISM HELPERS
# ---------------------------------

def maybe_double_space(text: str) -> str:
    # 8% chance to replace a single space with double space
    if " " not in text or random.random() >= 0.08:
        return text
    idxs = [i for i, ch in enumerate(text) if ch == " "]
    i = random.choice(idxs)
    return text[:i] + "  " + text[i + 1 :]




def maybe_trailing_punct(text: str) -> str:
    # 10% chance to add trailing punctuation, but not crazy
    if random.random() >= 0.10:
        return text
    return text + random.choice(["...", "??", "!!"])




def maybe_hold_letter(text: str) -> str:
    # 3% chance, and only a short repeat
    if len(text) < 3 or random.random() >= 0.03:
        return text
    idx = random.randint(0, len(text) - 2)
    ch = text[idx]
    if ch.isalpha():
        repeat = ch * random.randint(2, 3)
        return text[:idx] + repeat + text[idx + 1 :]
    return text




def maybe_lowercase(text: str) -> str:
    if random.random() < 0.12:
        return text.lower()
    return text




def slangify(text: str, phase: str) -> str:
    """Add occasional slang depending on phase."""
    base_slang = ["idk", "jesus", "man", "for real"]

    shock_slang = ["wtf", "holy shit", "my hands shaking rn"]

    emotional_slang = ["idk anymore", "can't handle this", "i swear"]

    routine_slang = ["ok", "i guess", "as usual"]



    pool = base_slang[:]

    if phase == "shock":
        pool += shock_slang

    if phase == "emotional":
        pool += emotional_slang

    if phase == "routine":
        pool += routine_slang



    if random.random() < 0.14:
        return random.choice(pool) + " " + text
    return text




def humanize(text: str, phase: str) -> str:
    text = maybe_double_space(text)
    text = maybe_hold_letter(text)
    text = maybe_trailing_punct(text)
    text = maybe_lowercase(text)
    text = slangify(text, phase)
    return text




# ---------------------------------
# TEMPLATES (UPGRADED)
# ---------------------------------

def shock_text() -> str:
    patterns = [
        f"{random.choice(STREETS)}, windows blown out",
        f"anyone seen smoke near {random.choice(LANDMARKS)}",
        f"{random.choice(NEIGHBORHOODS)} shaking again",
        f"just heard a boom near {random.choice(STREETS)}",
        f"{random.choice(APARTMENTS)} rattled hard",
        f"sirens nonstop near {random.choice(METRO)}",
        f"no signal from my family in {random.choice(NEIGHBORHOODS)}",
        "loud bang, no idea where from",
        "any updates? my phone keeps buzzing",
        "dogs barking like crazy rn",
    ]
    return random.choice(patterns)




def negotiation_text() -> str:
    patterns = [
        "pls stop posting coords, it's dangerous",
        "admins say delete vids with street signs",
        "if you share info mark it verified or rumor ok",
        "old footage again, stop reposting it",
        "this chat is for alerts, not panic spam",
        "dont post troop moves here",
        "remove faces and plates from videos pls",
        "mods will ban for sharing exact locations",
    ]
    return random.choice(patterns)




def polyvocal_text() -> str:
    patterns = [
        f"people in {random.choice(NEIGHBORHOODS)} say it's quiet, others say chaos, idk",
        "this video feels staged ngl, something off",
        "occupiers bring food on camera but bombed the bakery last week",
        f"my friend in {random.choice(NEIGHBORHOODS)} says soldiers helped with evac, another says they looted everything",
        "city looks different in every clip",
        "can't tell what's real anymore in these channels",
        "some say it's propaganda, some say it's truth, who knows",
        "we watch same war and still see different things",
    ]
    return random.choice(patterns)




def emotional_text() -> str:
    patterns = [
        "i'm tired of being scared every damn second",
        "rashists ruined everything here",
        "i miss normal mornings so much",
        "i miss the sea and not thinking about sirens",
        "hate this mix of fear and anger in my chest",
        "can't sleep at all, every sound feels like shelling",
        "i want my old life back so bad",
        "feels like this will never end",
    ]
    return random.choice(patterns)




def routine_text() -> str:
    patterns = [
        f"water truck on {random.choice(STREETS)} until 16:00",
        "power out again in block c",
        "queue for bread already around the corner",
        f"checkpoint moved closer to {random.choice(LANDMARKS)}",
        "traffic crazy near old bridge, avoid if you can",
        "quiet here today, weird feeling",
        "generator broke again, anyone know a good electrician",
        "same schedule: water in morning, blackout in evening",
        "line at pharmacy going outside already",
    ]
    return random.choice(patterns)




def generate_message_text(phase: str) -> str:
    if phase == "shock":
        base = shock_text()

    elif phase == "negotiation":
        base = negotiation_text()

    elif phase == "polyvocal":
        base = polyvocal_text()

    elif phase == "emotional":
        base = emotional_text()

    elif phase == "routine":
        base = routine_text()

    else:
        base = "..."



    return humanize(base, phase)




# ---------------------------------
# TIMELINE GENERATION
# ---------------------------------

def generate_timeline(n: int = NUM_MESSAGES):
    messages = []
    current_time = START_TIME

    for i in range(n):
        # random gap between messages
        current_time += timedelta(minutes=random.randint(5, 45))

        phase = phase_for_index(i, n)
        author = random.choice(PARTICIPANTS)

        reply_to = None
        if i > 8 and random.random() < 0.20:
            reply_to = random.randint(1, i)

        text = generate_message_text(phase)

        msg = {
            "id": i + 1,
            "author": author,
            "timestamp": current_time.isoformat(),
            "phase": phase,
            "text": text,
            "reply_to_id": reply_to,
        }
        messages.append(msg)

    return messages


def save_timeline(messages):
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(messages)} messages to {OUTPUT_PATH}")




if __name__ == "__main__":
    msgs = generate_timeline()
    save_timeline(msgs)
