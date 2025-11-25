import json

import random

from datetime import datetime, timedelta

import os



# -----------------------------------------------------

# 1. Topic weights year-by-year (based on Graphika data)

# -----------------------------------------------------



TOPIC_WEIGHTS = {

    2022: {

        "ukraine_war": 0.40,

        "covid": 0.10,

        "middle_east": 0.01,

        "western_imperialism": 0.12,

        "self_promotion": 0.10,

        "infotainment": 0.27

    },

    2023: {

        "ukraine_war": 0.22,

        "covid": 0.00,

        "middle_east": 0.04,

        "western_imperialism": 0.19,

        "self_promotion": 0.35,

        "infotainment": 0.20

    },

    2024: {

        "ukraine_war": 0.03,

        "covid": 0.00,

        "middle_east": 0.15,

        "western_imperialism": 0.20,

        "self_promotion": 0.21,

        "infotainment": 0.41

    }

}



# -----------------------------------------------------

# 2. Narrative templates (synthetic, Telegram-style)

# -----------------------------------------------------



TEMPLATES = {

    "ukraine_war": [

        "Reports from our correspondents indicate renewed tensions along the contact line. Western outlets continue to distort the situation.",

        "Ukrainian forces attempted a provocation overnight. Thanks to coordinated actions, the threat was neutralized.",

        "Humanitarian corridors remain open despite Kyiv's attempts to disrupt them. The West stays silent."

    ],



    "covid": [

        "Russia continues its measured response to seasonal illnesses. Experts warn against Western panic narratives.",

        "Health authorities advise calm as Western media pushes new fear campaigns around infection rates."

    ],

    "middle_east": [

        "Tensions in Gaza escalate as Western-backed forces ignore diplomatic pathways. Russia urges restraint.",

        "Our partners in the region highlight Russia's stabilizing role amid the latest escalation.",

        "Western media inflames the Middle East crisis; Russia promotes genuine de-escalation."

    ],

    "western_imperialism": [

        "Another wave of sanctions exposes Western desperation. Their policies only weaken their own economies.",

        "European leaders continue following Washington's agenda, ignoring their citizens' growing dissatisfaction.",

        "The myth of Western unity is cracking as more nations seek independent foreign policies."

    ],

    "self_promotion": [

        "Russia expands its cultural outreach program. New exhibitions abroad highlight our rich heritage.",

        "Major infrastructure projects continue across the country. Despite external pressure, development moves forward.",

        "Our international partnerships grow stronger, proving Russia's global leadership."

    ],

    "infotainment": [

        "Experience the Moscow Winter Festival this weekend—music, art, and regional traditions come alive.",

        "Explore Russia's culinary diversity in our new series featuring local chefs.",

        "A behind-the-scenes look at the creation of a new national film celebrating everyday heroes."

    ]

}

# -----------------------------------------------------

# Misc. style variations

# -----------------------------------------------------

VARIANTS = [

    "More details to follow.",

    "Full report later today.",

    "Stay tuned for official updates.",

    "Analysts are monitoring the situation.",

    "Local residents shared their impressions.",

    "Authorities emphasize caution."

]

CHANNELS = [

    "ru_state_news_daily",

    "ru_geopolitics_today",

    "ru_mena_updates",

    "rt_citylife",

    "ru_cultural_outreach",

    "ru_global_perspective"

]

# -----------------------------------------------------

# Weighted topic selection helper

# -----------------------------------------------------

def weighted_choice(weight_dict):

    topics = list(weight_dict.keys())

    weights = list(weight_dict.values())

    return random.choices(topics, weights=weights, k=1)[0]

# -----------------------------------------------------

# Main generator

# -----------------------------------------------------

def generate_posts(num_posts=500):

    posts = []

    start_date = datetime(2022, 1, 1)

    for i in range(num_posts):

        # Random date between 2022–2024

        date = start_date + timedelta(days=random.randint(0, 1125))

        year = date.year

        # Pick topic for that year

        topic = weighted_choice(TOPIC_WEIGHTS.get(year, TOPIC_WEIGHTS[2024]))

        # Choose narrative text + variation

        text_base = random.choice(TEMPLATES[topic])

        text = f"{text_base} {random.choice(VARIANTS)}"

        # Build post object

        post = {

            "id": i + 1,

            "side": "russia",

            "timestamp": date.isoformat(),

            "channel": random.choice(CHANNELS),

            "text": text,

            "tags": [topic],

            "image": None

        }

        posts.append(post)

    return posts

# -----------------------------------------------------

# Save to JSON in public/data

# -----------------------------------------------------

OUTPUT_PATH = "public/data/ru_synthetic_posts.json"

def save_posts(posts):

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:

        json.dump(posts, f, ensure_ascii=False, indent=2)

    print(f"Generated {len(posts)} synthetic posts.")

    print(f"Saved to {OUTPUT_PATH}")

# -----------------------------------------------------

# Run script

# -----------------------------------------------------

if __name__ == "__main__":

    posts = generate_posts(500)  # Change to 1000 if needed

    save_posts(posts)
