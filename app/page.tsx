"use client";



import { useEffect, useMemo, useRef, useState } from "react";

import crisisTimelineData from "../data/crisis_timeline.json";



type Phase = "shock" | "negotiation" | "polyvocal" | "emotional" | "routine";



type Message = {

  id: number;

  author: string;

  timestamp: string;

  phase: Phase;

  text: string;

  reply_to_id: number | null;

};



const allMessages = crisisTimelineData as Message[];



const CURRENT_USER = "Miguel";



const MONTHS_SHORT = [

  "Jan",

  "Feb",

  "Mar",

  "Apr",

  "May",

  "Jun",

  "Jul",

  "Aug",

  "Sep",

  "Oct",

  "Nov",

  "Dec",

];



function pad2(n: number) {

  return n.toString().padStart(2, "0");

}



function formatTime(ts: string) {

  const d = new Date(ts);

  const month = MONTHS_SHORT[d.getMonth()];

  const day = d.getDate();

  const h = pad2(d.getHours());

  const m = pad2(d.getMinutes());

  return `${month} ${day}, ${h}:${m}`;

}



function initials(name: string) {

  return name

    .split(" ")

    .map((p) => p[0])

    .join("")

    .toUpperCase()

    .slice(0, 2);

}



// Real-time mapping config
// Venezuela time: November 25, 2025, 13:36 (UTC-4 = 17:36 UTC)
const SIM_START = new Date("2025-11-25T17:36:00Z").getTime();
// One message every 30s of real time (change if you want faster/slower)
const STEP_MS = 30_000;



function computeVisibleIndex(total: number): number {

  if (total === 0) return 0;

  const now = Date.now();

  const elapsed = Math.max(0, now - SIM_START);

  const rawIndex = Math.floor(elapsed / STEP_MS);

  // loop forever

  return rawIndex % total;

}



const phaseConfig: Record<

  Phase,

  { label: string; accent: string; bgBubble: string; bgHeader: string }

> = {

  shock: {

    label: "Stage 1 – Shock / Pereklychka",

    accent: "#60a5fa",

    bgBubble: "#0b1220",

    bgHeader: "radial-gradient(circle at top, #0f172a 0, #020617 70%)",

  },

  negotiation: {

    label: "Stage 2 – Negotiation & Safety",

    accent: "#a5b4fc",

    bgBubble: "#0b1120",

    bgHeader: "radial-gradient(circle at top, #0f172a 0, #020617 70%)",

  },

  polyvocal: {

    label: "Stage 3 – Polyvocal Narratives & Critique",

    accent: "#c4b5fd",

    bgBubble: "#111827",

    bgHeader: "radial-gradient(circle at top, #1b1630 0, #020617 70%)",

  },

  emotional: {

    label: "Stage 4 – Emotional Surge",

    accent: "#fb7185",

    bgBubble: "#111827",

    bgHeader: "radial-gradient(circle at top, #111827 0, #020617 70%)",

  },

  routine: {

    label: "Stage 5 – Routine Crisis",

    accent: "#a3e635",

    bgBubble: "#0f172a",

    bgHeader: "radial-gradient(circle at top, #111827 0, #020617 70%)",

  },

};



const stageDescriptions: Record<Phase, string> = {

  shock:

    "First hours of the crisis: people try to locate explosions, blocked streets and missing relatives. Messages are short, functional and focused on survival.",

  negotiation:

    "After the initial shock, the chat begins to discuss rules: what is safe to post, how to avoid helping the enemy, how to separate verified information from rumors.",

  polyvocal:

    "Different stories and interpretations collide: accusations of collaboration, discussions about propaganda, conflicting accounts of what the city looks like.",

  emotional:

    "Anger, grief, fear and nostalgia break into the channel. People curse, mourn, reminisce and argue, all in the same stream as practical updates.",

  routine:

    "The crisis becomes background: outages, water trucks, queues and movement of checkpoints. The chat documents how catastrophe turns into everyday life.",

};



export default function Home() {

  // sort once, stable order

  const sortedMessages = useMemo(

    () =>

      [...allMessages].sort(

        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()

      ),

    []

  );



  const [visibleIndex, setVisibleIndex] = useState(0);

  const [showIntro, setShowIntro] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    if (sortedMessages.length === 0) return;



    const updateIndex = () => {

      setVisibleIndex(computeVisibleIndex(sortedMessages.length));

    };



    updateIndex(); // initial sync

    const id = setInterval(updateIndex, 2000);

    return () => clearInterval(id);

  }, [sortedMessages.length]);



  const visibleMessages = useMemo(

    () => sortedMessages.slice(0, visibleIndex + 1),

    [sortedMessages, visibleIndex]

  );



  // Auto-scroll to bottom when new messages arrive

  useEffect(() => {

    if (messagesEndRef.current) {

      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });

    }

  }, [visibleMessages.length]);



  const currentPhase: Phase =

    visibleMessages.length > 0

      ? visibleMessages[visibleMessages.length - 1].phase

      : "shock";



  const cfg = phaseConfig[currentPhase];



  return (

    <main

      style={{

        height: "100vh",

        overflow: "hidden",

        margin: 0,

        backgroundColor: "#020617",

        color: "#e5e7eb",

        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

        display: "flex",

        alignItems: "stretch",

        justifyContent: "center",

        padding: "1.2rem",

        position: "relative",

      }}

    >

      {showIntro && (

        <div

          style={{

            position: "fixed",

            inset: 0,

            backgroundColor: "rgba(2,6,23,0.96)",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            zIndex: 50,

          }}

        >

          <div

            style={{

              width: "100%",

              maxWidth: 720,

              borderRadius: 24,

              border: "1px solid #111827",

              background:

                "radial-gradient(circle at top, #020617 0, #020617 45%, #020617 100%)",

              boxShadow: "0 30px 90px rgba(0,0,0,0.8)",

              padding: "1.8rem 2rem 1.6rem",

            }}

          >

            <h1

              style={{

                fontSize: "1.4rem",

                margin: 0,

                marginBottom: "0.6rem",

              }}

            >

              Crisis Chat – Synthetic Wartime Telegram

            </h1>

            <p

              style={{

                fontSize: "0.9rem",

                opacity: 0.8,

                marginBottom: "0.9rem",

              }}

            >

              This interface is a continuous, synthetic reconstruction of a

              Telegram group chat during the Russian invasion of Ukraine. The

              messages are fictional, but the way the chat behaves follows

              patterns described in research on real wartime channels.

            </p>



            <p

              style={{

                fontSize: "0.85rem",

                opacity: 0.78,

                marginBottom: "0.7rem",

              }}

            >

              Over time, the chat moves through different stages:

            </p>



            <ul

              style={{

                fontSize: "0.82rem",

                opacity: 0.8,

                paddingLeft: "1.1rem",

                marginTop: 0,

                marginBottom: "0.9rem",

              }}

            >

              <li>

                <strong>Shock / Pereklychka</strong> – people locate danger and

                check if others are alive.

              </li>

              <li>

                <strong>Negotiation &amp; Safety</strong> – the group decides what

                is safe to post and how to avoid helping the enemy.

              </li>

              <li>

                <strong>Polyvocal Narratives</strong> – competing stories,

                interpretations and critiques of the occupation appear.

              </li>

              <li>

                <strong>Emotional Surge</strong> – anger, grief, nostalgia and

                insults flood the feed.

              </li>

              <li>

                <strong>Routine Crisis</strong> – queues, outages and checkpoints

                become everyday background.

              </li>

            </ul>



            <p

              style={{

                fontSize: "0.8rem",

                opacity: 0.7,

                marginBottom: "1.1rem",

              }}

            >

              The chat runs in real time: new messages appear continuously, and

              the current stage changes as the simulated timeline advances. No

              real Telegram data is shown here.

            </p>



            <p

              style={{

                fontSize: "0.75rem",

                opacity: 0.55,

                marginTop: "1.4rem",

                marginBottom: "1.1rem",

                lineHeight: 1.4,

              }}

            >

              This project is inspired by the research described in:<br />

              <em>

                Bareikytė, T. &amp; Makhortykh, A. (2024). Materiality of Wartime

                Communication: The Politics of Presence and Publicness in the

                Ukrainian War on Telegram.

              </em>

            </p>



            <div

              style={{

                display: "flex",

                justifyContent: "flex-end",

                gap: 10,

              }}

            >

              <button

                onClick={() => setShowIntro(false)}

                style={{

                  borderRadius: 999,

                  border: "1px solid #374151",

                  backgroundColor: "transparent",

                  color: "#e5e7eb",

                  padding: "0.35rem 0.9rem",

                  fontSize: "0.8rem",

                  cursor: "pointer",

                }}

              >

                Enter the chat

              </button>

            </div>

          </div>

        </div>

      )}



      <div

        style={{

          width: "100%",

          maxWidth: 900,

          height: "100%",

          borderRadius: 24,

          border: "1px solid #111827",

          overflow: "hidden",

          boxShadow: "0 26px 80px rgba(0,0,0,0.65)",

          display: "flex",

          flexDirection: "column",

          backgroundColor: "#020617",

        }}

      >

        {/* header */}

        <div

          style={{

            padding: "0.8rem 1rem",

            borderBottom: "1px solid #0f172a",

            background: cfg.bgHeader,

            display: "flex",

            alignItems: "center",

            gap: 10,

          }}

        >

          <div

            style={{

              width: 36,

              height: 36,

              borderRadius: "50%",

              backgroundColor: "#020617",

              boxShadow: "0 0 0 1px #111827 inset",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontSize: 14,

              fontWeight: 600,

            }}

          >

            CC

          </div>

          <div style={{ flex: 1 }}>

            <div style={{ fontSize: 14, fontWeight: 600 }}>

              Crisis Chat · City Channel

            </div>

            <div style={{ fontSize: 11, opacity: 0.65 }}>

              synthetic reconstruction of a wartime Telegram chat

            </div>

          </div>

          <div

            style={{

              fontSize: 10,

              textTransform: "uppercase",

              letterSpacing: "0.12em",

              padding: "2px 8px",

              borderRadius: 999,

              border: `1px solid ${cfg.accent}80`,

              color: cfg.accent,

            }}

          >

            {cfg.label}

          </div>

        </div>



        {/* stage explanation */}

        <div

          style={{

            padding: "0.6rem 1rem 0.4rem",

            borderBottom: "1px solid #0f172a",

            backgroundColor: "#020617",

          }}

        >

          <p

            style={{

              fontSize: 12,

              opacity: 0.8,

              margin: 0,

            }}

          >

            {stageDescriptions[currentPhase]}

          </p>

        </div>



        {/* messages */}

        <div

          style={{

            flex: 1,

            overflowY: "auto",

            padding: "0.9rem 1.1rem 1.2rem",

            backgroundImage:

              "radial-gradient(circle at top, rgba(15,23,42,0.7), #020617 55%)",

          }}

        >

          {visibleMessages.map((msg) => (

            <MessageBubble

              key={msg.id}

              msg={msg}

              isSelf={msg.author === CURRENT_USER}

            />

          ))}

          <div ref={messagesEndRef} />

          {visibleMessages.length === 0 && (

            <div

              style={{

                marginTop: "2rem",

                textAlign: "center",

                fontSize: 12,

                opacity: 0.7,

              }}

            >

              Waiting for the first messages of the crisis…

            </div>

          )}

        </div>



        {/* fake input bar */}

        <div

          style={{

            padding: "0.6rem 1rem",

            borderTop: "1px solid #0f172a",

            backgroundColor: "#020617",

            display: "flex",

            alignItems: "center",

            gap: 8,

          }}

        >

          <div

            style={{

              flex: 1,

              borderRadius: 999,

              backgroundColor: "#020617",

              boxShadow: "0 0 0 1px #111827 inset",

              padding: "0.4rem 0.8rem",

              fontSize: 12,

              opacity: 0.6,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",

            }}

          >

            Type a message… (simulation)

          </div>

          <div

            style={{

              width: 30,

              height: 30,

              borderRadius: "50%",

              backgroundColor: "#0ea5e9",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontSize: 16,

              fontWeight: 600,

              color: "#020617",

            }}

          >

            ↗︎

          </div>

        </div>

      </div>

    </main>

  );

}



function MessageBubble({ msg, isSelf }: { msg: Message; isSelf: boolean }) {

  const cfg = phaseConfig[msg.phase];



  return (

    <div

      style={{

        display: "flex",

        justifyContent: isSelf ? "flex-end" : "flex-start",

        marginBottom: 6,

      }}

    >

      {!isSelf && (

        <div

          style={{

            width: 28,

            height: 28,

            borderRadius: "50%",

            backgroundColor: "#020617",

            boxShadow: "0 0 0 1px #111827 inset",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            fontSize: 11,

            fontWeight: 600,

            marginRight: 8,

            marginTop: 4,

          }}

        >

          {initials(msg.author)}

        </div>

      )}



      <div

        style={{

          maxWidth: "70%",

          display: "flex",

          flexDirection: "column",

          alignItems: isSelf ? "flex-end" : "flex-start",

        }}

      >

        {!isSelf && (

          <span

            style={{

              fontSize: 11,

              opacity: 0.7,

              marginBottom: 1,

            }}

          >

            {msg.author}

          </span>

        )}

        <div

          style={{

            backgroundColor: isSelf ? "#0ea5e9" : cfg.bgBubble,

            color: isSelf ? "#020617" : "#e5e7eb",

            padding: "0.45rem 0.7rem",

            borderRadius: isSelf ? "14px 14px 4px 14px" : "14px 14px 14px 4px",

            fontSize: 13,

            lineHeight: 1.35,

            boxShadow: "0 10px 22px rgba(0,0,0,0.35)",

            border: isSelf ? "none" : "1px solid #020617",

          }}

        >

          {msg.text}

        </div>

        <span

          style={{

            fontSize: 10,

            opacity: 0.55,

            marginTop: 2,

          }}

        >

          {formatTime(msg.timestamp)}

        </span>

      </div>



      {isSelf && (

        <div style={{ width: 28, height: 28, marginLeft: 8, marginTop: 4 }} />

      )}

    </div>

  );

}
