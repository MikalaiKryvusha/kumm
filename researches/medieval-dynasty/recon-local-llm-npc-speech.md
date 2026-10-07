# Recon — local LLM for NPC speech beside the game (2026-10-08)

Swept 2026-10-07/08, roughly 23:40–00:25. This was read-only web research. Most quotes come from page text that I downloaded with curl, stripped of HTML and searched as text. Three kinds of quote are marked:

- **(summary-fetched)** means the quote passed through a WebFetch summary and was not re-checked in the raw text.
- **(search-snippet)** means only a search engine's summary was seen. The page itself was blocked (403 or Cloudflare).
- **[estimate]** means my own arithmetic, not a source.

Where they are visible, dates are the source's own dates.

The question under test is the working assumption: *the LLM gives the world its VOICE (rumours, herald, chronicle, NPC remarks grounded in the simulation journal), and does NOT make economic decisions.*

---

## 1. Existing mods and games

### 1.1 Skyrim / Fallout 4 mods

**Mantella** (Skyrim SE, Skyrim VR, Fallout 4). Main source: the docs at https://art-from-the-machine.github.io/Mantella/

- **Cloud by default, local optional.** The quick start uses OpenRouter: "you will have an OpenRouter account set up with Gemma 4 26B A4B (free)". For local use the docs list koboldcpp, text-generation-webui, LM Studio and Ollama: "Download a local model, such as Gemma 4 E4B", and for Ollama "For example, Gemma 3 4B". It talks to any endpoint: "Mantella supports all language model services with an OpenAI-compatible API." https://art-from-the-machine.github.io/Mantella/pages/installation.html
- **The docs admit small models are weak at memory work:** "Some smaller models may struggle to handle long term conversations and memory summarising." (same page)
- **Running the LLM on a second PC is a documented option.** The page has a section "Running Local Services from a Second PC". (same page)
- **Memory is a summary saved at the end of each conversation:** "When a conversation ends, a summary of the conversation is saved to a local text file for each NPC in the conversation. These summaries are then loaded the next time an NPC is spoken with." (same page)
- **Radiant (NPC↔NPC) conversations exist:** "Radiant conversations can also be enabled in the MCM menu. These are conversations that are randomly started between idle NPCs." (same page)
- **Giving the LLM more actions makes it worse:** "The more actions that are enabled, the more LLMs will struggle to manage the number of actions, so ideally only the actions you are interested in should be enabled. Some actions are experimental, and may cause bugs over long playthroughs." (same page)
- **Latency target and costs:**
  - "Long response times kill immersion." https://art-from-the-machine.github.io/Mantella/
  - "you should aim to select an LLM provider / model that can return a response in less than 0.5 seconds"
  - Local use "has the advantage of eliminating network latency and providing consistent response times" if "you have a high-end GPU".
  - Lip sync "Lazy" and "Fast Response Mode" each save "about 0.5 seconds".
  - https://art-from-the-machine.github.io/Mantella/pages/real_time_npcs.html
- **The lore fine-tune aged badly.** On the Llama 3 8B Skyrim fine-tune: "This model is now very outdated and performs worse than newer, non fine-tuned models. It is therefore no longer recommended for use with Mantella." https://art-from-the-machine.github.io/Mantella/pages/fine_tuned_models.html
- **How game events reach the prompt.** This is a user-proposed prompt in GitHub issue #640 (2026-01-13), so it is not necessarily the shipped default: "In-game events appear in brackets before player text. Example: (The player picked up a pair of gloves) … React to significant events only (combat, danger, important items). Ignore minor events." It also says: "Keep responses brief, 1-3 sentences." https://github.com/art-from-the-machine/Mantella/issues/640
- **Early local-model failure, from a user** (issue #67, 2023-11-14): "I have tried LLama2-chat 7b, OpenChat 3.5 7b, Mistral 7b and some fine-tunes of mistral, but all of them frequently broke character or just said nonsense." The same user added that gpt3.5 "tends to just make things up". https://github.com/art-from-the-machine/Mantella/issues/67
- **Press latency figures:**
  - XDA, using a cloud model: "I used the online version of the free liquid/lfm-40b LLM for the majority of my tests, and the NPCs took anywhere between two-to-six seconds to respond." https://www.xda-developers.com/i-used-mods-to-bring-ai-powered-npcs-to-skyrim/
  - UploadVR: "while there is noticeable latency, you can still see how the concept redefines what it means to inhabit a virtual world". On a paid model: "the wait for a response became much shorter and the conversations seemed to flow more naturally". https://www.uploadvr.com/playing-skyrim-vr-with-chatgpt-powering-npc-conversations/
- **Players poke at the fourth wall.** XDA: "I did manage to aggravate a couple of NPCs after repeated attempts to get them to admit that Skyrim is just a virtual world!" (XDA, above)

**CHIM (formerly Herika)** (Skyrim). Source: https://github.com/Dwemer-Dynamics/HerikaServer

- It is a separate server: "This component serves as a bridge between the SKSE plugin and various AI providers of text-to-speech, speech-to-text, and AI-based chat generators such as ChatGPT, MeloTTS, koboldcpp, Openrouter, XTTS, etc."
- Claimed features: "Long-term memory for in-game characters, employing various techniques to mitigate the lack of long-term memory in current LLMs" and "Deep world awareness".
- The README states no latency or VRAM numbers.

**SkyrimNet** (Skyrim). Source: https://github.com/MinLL/SkyrimNet-GamePlugin. It is the most complete public "LLM grounded in live game state" design I found.

- **Runs in-process, and explains why:** "Most AI mods for Skyrim work by running a separate program … This introduces latency, a considerable amount of system load, and many sources of bugs/issues. SkyrimNet is different. It is a native Windows DLL that loads inside Skyrim itself." Also: "Game state is read straight from memory (no syncing, no serialization round-trips between processes)."
- **Grounding works through templates, not free recall:** "The Inja-based prompt templating system reads live game data through over a hundred built-in decorators (player and NPC state, equipment, combat, factions, magic, location, time, memory retrieval, and more)".
- **Scoped world facts:** "Conditions are written as short template expressions like `contains(get_location(actorUUID), "Whiterun")` or `get_quest_stage("MQ104") >= 13`, so a fact can enter the world the moment a quest milestone fires and stay scoped to the characters it should reach." Each entry "can be either always injected into every prompt whose condition passes, or pulled in semantically".
- **Different models for different jobs:** "you can assign different models to different jobs — a fast, cheap model for action selection, a smarter model for dialogue." It is cloud by default: "SkyrimNet talks to OpenRouter (or any OpenAI-compatible endpoint)".
- **Memory and diaries:**
  - "Each NPC has their own private memory store." Retrieval uses "A local, GPU-accelerated embedding model".
  - "A memory of being attacked outweighs a memory of a passing pleasantry."
  - "NPCs can compose diary entries summarizing their day. Each entry becomes a searchable memory."
- **A counter-example to our assumption: an LLM that also decides.** The README lists the add-on IntelEngine, where "An LLM Dungeon Master then decides when NPCs should act unprompted: dynamic quest creation …, ambushes from people you've wronged, gossip chains that propagate between NPCs, and faction politics … off-screen developments in wars". There is no evidence of how well this balances. It is a mod feature list, not a measurement.

### 1.2 Mount & Blade II: Bannerlord

- **"Inworld Calradia"** by Bloc (Mar 2023) is cloud-based (Inworld). It is "utilizing the GPT AI and text-to-speech features from Inworld AI". The cloud cost shaped the design. Quoting the modder: "you cannot talk with same townfolk with same personality twice in this version. This is, unfortunately a limitation I had to put to avoid thousands of villager generation and causing a mess in your account and in Inworld's account." https://exputer.com/news/games/mount-and-blade-2-bannerlord-mod/
- **"AI Influence"** (Nexus; the page answers 403 to scripts) **(search-snippet)**. Supported backends are given as "OpenRouter (for GPT-4, Claude, Gemini, etc.), Player2 (local server, free), Ollama (local models, free), and KoboldCpp (local models, free)". Claim: "every line is generated in real time". Mirror: https://catalogue.smods.ru/archives/402946 (not verified on page).

### 1.3 Commercial games and vendor tech

**NVIDIA ACE: small on-device models, already shipping**

- **Mecha BREAK, Nemotron-4 4B** (Aug 21, 2024). The model "is optimized for low memory usage, offering faster response times". It was distilled from 15B, then "the SLM is quantized". https://blogs.nvidia.com/blog/ai-decoded-gamescom-ace-nemotron-instruct
- **inZOI, "Smart Zoi"** (Mar 13, 2025): "The NVIDIA ACE technology that powers Smart Zoi is a .5B billion parameter Mistral NeMo Minitron small language model." It drives actions as well as words: "The actions and thoughts of Smart Zoi are governed by an on-device NVIDIA ACE Small Language Model". Also: "at the end of each day, Smart Zois will adjust their personal schedule of activities based on their experiences". https://www.nvidia.com/en-gb/geforce/news/nvidia-ace-naraka-bladepoint-inzoi-launch-this-month/
  - Smart Zoi requirement tiers **(search-snippet)**, from game8/TechRadar: minimum "Nvidia RTX 3060 (8 GB VRAM)", recommended "RTX 5070 (12GB VRAM) or a Nvidia 4070 Super (12GB VRAM)".
  - A player FPS anecdote **(search-snippet, Steam forums)**: "a loss of 2 FPS when keeping settings on medium … and a loss of 10 FPS when keeping settings on high". Not verified.
- **PUBG Ally, Mistral-NeMo-Minitron-2B on the player's GPU.** This is the most useful single source for us. https://developer.nvidia.com/blog/how-krafton-built-pubg-ally-a-co-playable-character-powered-by-nvidia-ace/
  - Local because cloud was too slow: "When we tested cloud-hosted LLM approaches, the combination of network latency and model inference latency often made responses feel too slow for live squad communication." Also: "players consistently valued the SLM's responsiveness and sense of presence."
  - Fits beside a heavy game: "PUBG is a graphically rich title that already consumes a significant share of GPU memory … we further quantized it for client-side deployment. The quantized model fits within the VRAM headroom that remains after PUBG, allowing PUBG Ally to run on GPUs with as little as 8GB of total VRAM."
  - **Speech and decisions are split:** "A System 1 behavior tree handles reflex-level gameplay such as movement and combat at game tick rate, while the System 2 language model manages deliberate reasoning, player coordination, and natural speech generation." Also: "we didn't want every in-game reaction to wait on language reasoning."
  - **Grounding:**
    - "we constrained the world: a single map, Sanhok, and a single mode, AI Duo, with a fixed item taxonomy that defines what Ally can use, what it can recognize but not use, and what doesn't exist in this context."
    - "Ally's factual claims trace back to a value it deliberately pulled from the engine moments earlier, not to something the model guessed."
    - A teacher model was used "with a deterministic PUBG specification … in a larger teacher model's system prompt".
  - **Prompt shape for speed:**
    - "we designed the prompt structure to make the best use of the KV cache."
    - "Stable instructions and gameplay context are kept as consistent as possible across turns, while only the most relevant real-time information is updated each turn."
  - **Testing:** "automated evaluations to check whether Ally followed the expected interaction protocol … live playtests and A/B tests … feedback from over a thousand real players."
  - Beta page (June 17, 2026): it runs "locally on RTX GPUs with at least 8GB of VRAM". It uses "an in-game inferencing toolset streamlines AI execution directly alongside the game's graphics engine". Language: "generates context-aware responses in English". https://www.nvidia.com/en-us/geforce/news/pubg-ally-ai-teammate-beta-available-now/
- **The NVIDIA In-Game Inferencing SDK (NVIGI) schedules GPU work on purpose.** https://docs.nvidia.com/nvigi-sdk/1.6.0/docs/nvigi_core/docs/GpuSchedulingForAI.html
  - "As the rate at which an unloaded GPU can produce AI tokens can be many times higher than a human's ability to listen to and understand them, it often doesn't make sense to run AI at maximum rate at the expense of graphics frame rate."
  - Modes include "SchedulingMode::kPrioritizeGraphics - try to maximize game FPS".
  - It must be built into the game: "NVIGI needs to know the D3D direct queue that your game is using for graphics."
  - How to measure: "add a way to toggle the AI feature …, run a benchmark twice with the feature enabled and disabled, and report the difference in total frame time." It warns against GPU timestamp queries for this.

**Inworld.** Ubisoft's NEO NPC prototype used "Inworld's Large Language Model (LLM)". The company later moved toward general voice AI **(search-snippet, aiwiki)**: "repositioning from a character-creation platform specifically for games toward a general-purpose real-time voice AI infrastructure provider". Not verified.

**Ubisoft NEO NPC** (GDC 2024). https://news.ubisoft.com/en-us/article/5qXdxhshJBXoanFZApdG3L

- Writers own the character: "a writer, who shapes their character, backstory, and conversationstyle, and then continues to tweak".
- Guardrails: "the team has a lot of filters in place to catch toxicity and inappropriate inputs on the part of the player".
- On player nonsense: "It's garbage in, garbage out".
- Drift: "we created a physically attractive female character … and its answers veered towards flirtatious and seductive, so we had to reprogram it".

**Ubisoft Ghostwriter** (Mar 21, 2023) is a precedent for pre-generation with a human or a filter in the loop:

- "Ghostwriter effectively generates first drafts of barks - phrases or sounds made by NPCs during a triggered event".
- "Rather than writing first draft versions themselves, Ghostwriter lets scriptwriters select and polish the samples generated".
- "Crowd chatter and barks are central features of player immersion … make the player feel like the game around them exists outside of their actions."
- https://news.ubisoft.com/en-us/article/7Cm07zbBGy4Xml6WgYi25d/the-convergence-of-ai-and-creativity-introducing-ghostwriter

**Vaudeville** (Bumblebee, 2023): a murder mystery built on free conversation.

- It started on cloud Inworld, which was costly: "In the first month we generated a huge amount of traffic, which resulted in a substantial bill from Inworld."
- Translation was done with a separate service: "DeepL to translate the dialogues to and from 12 different languages in real time".
- Reviews turned: "the games have started to receive negative reviews regarding the limitations of the AI". https://www.gamedeveloper.com/design/vaudeville-pre-mortem
- Later an offline beta: "built with LLMs, text-to-speech, and speech recognition models, all fine-tuned, prompted, and implemented to run locally". With a caveat: "Running LLMs locally can be quite demanding on players' GPUs". https://www.gamedeveloper.com/press-release/bumblebee-presents-its-new-offline-smart-npcs-engine
- The Steam "Recommended" spec is "Memory: 32 GB RAM Graphics: Nvidia RTX 2070". https://store.steampowered.com/app/2240920/Vaudeville
- **What players hated** (KeenGamer preview): https://keengamer.com/articles/previews/vaudeville-preview-the-ai-questioning-to-nowhere/
  - "the game's AI runs into frequent confusion"
  - "Getting any information is difficult when even the AI can't get its stories straight."
  - "instances of the AI giving contradictory information and not realising or acknowledging that fact"
  - "lots of stalling as the AI tries to understand your question"
  - "Having an organic conversation with the power of AI is nice at first, but the novelty wears off quickly."

**Suck Up!** (vampire talks its way into houses). The game needs the internet: its Steam requirements say "Network: Broadband Internet connection". The AI disclosure reads: "Players interact with AI characters using their voice, and the AI responds in real time based on tone and strategy." https://store.steampowered.com/app/2726370/Suck_Up/ No first-hand latency or model data was found. A "1-2 seconds" figure appeared only in a search snippet and is not verified.

**Whispers from the Star** (Anuttacon) also needs the internet: "Network: Broadband Internet connection". Its disclosure warns: "user input may influence the tone and direction of the AI's responses. As such, dialogue may sometimes involve strong language". https://store.steampowered.com/app/3730100/

**Generative Agents** (Park et al., 2023) is the academic reference for "a town that lives by itself". https://arxiv.org/abs/2304.03442

- Info diffusion works: "starting with only a single user-specified notion that one agent wants to throw a Valentine's Day party, the agents autonomously spread invitations".
- Embellishment is the typical hallucination: "At times, the agents hallucinated embellishments to their knowledge." One example: "Yuriko described her neighbor, Adam Smith, as an economist who 'authored Wealth of Nations'". The rate was measured: "Out of the 453 agent responses regarding their awareness of other agents, 1.3% (n=6) were found to be hallucinated." Tone drifts too: "the conversational style of these agents can feel overly formal". https://arxiv.org/html/2304.03442
- Cost: "simulate 25 agents for two days, costing thousands of dollars in token credits and taking multiple days to complete." (same)

**Prompt injection** is a known attack class for LLM NPCs: "we examine whether adversarial prompt injection can cause LLM-based NPCs to reveal hidden background secrets that are meant to remain undisclosed." (Shiomi et al., 25 Aug 2025) https://arxiv.org/abs/2508.19288

### 1.4 Medieval Dynasty

- **No AI, LLM or dialogue mod exists.** I queried the Nexus GraphQL API for every `medievaldynasty` mod on 2026-10-08 at 00:22: `total 73 got 73`. The regex `AI|LLM|GPT|chat|dialog|talk|conversation|voice|speech|rumo(u)r|gossip` matched one mod, and it is irrelevant: "SW_SpawnItems | Spawns items into your inventory through an item list and a Spawn dialog". The general web search also found none.
- **The game's own GPU spec.** It recommends "DirectX 12 compatible GPU, 8GB dedicated VRAM"; the minimum is "6GB dedicated VRAM". https://store.steampowered.com/app/1129580/ Its actual VRAM use on the owner's settings was **not found**; it has to be measured.

### 1.5 Cross-cut: what worked, what hurt

| Theme | Evidence |
|---|---|
| Grounding that works | Engine values pulled per turn plus a closed vocabulary (PUBG Ally). Templated decorators and condition-scoped facts (SkyrimNet). Bracketed event lines (Mantella). |
| Latency | Cloud: "two-to-six seconds" (XDA). Mantella's real-time target is "<0.5 s" from the LLM. PUBG chose local because cloud "felt too slow". |
| Local vs cloud | Shipping NVIDIA titles are local SLMs of 0.5B (inZOI), 2B (PUBG Ally) and 4B (Mecha BREAK). Mods default to cloud (Mantella, SkyrimNet) with local optional. |
| VRAM | PUBG Ally runs in "8GB of total VRAM" beside PUBG. Smart Zoi minimum is 8 GB, recommended 12 GB (snippet). |
| Liked | Responsiveness and "sense of presence" (PUBG playtests). Conversations "tailored to my choices" (UploadVR). |
| Hated / failure modes | Contradictions and "can't get its stories straight" (Vaudeville). Breaking character with small 7B models (Mantella #67). Embellished facts (Generative Agents, 1.3%). Players trying to break the fourth wall (XDA). Novelty wearing off (KeenGamer). Bills (Vaudeville, Inworld Calradia). Overly formal tone (Generative Agents). |

**Verdict on the working assumption: supported.** Every shipped local system keeps fast, consequential decisions in deterministic code. PUBG Ally uses a "System 1 behavior tree"; its LLM speaks and coordinates. The documented pain points are factual drift, contradiction and cost. These hurt least when the LLM only re-tells facts that code has already decided.

Two counter-examples exist. inZOI lets its SLM adjust Zoi schedules, and SkyrimNet's IntelEngine add-on lets an LLM "Dungeon Master" spawn quests. Neither involves an economy that must balance, and neither published any measure of consistency.

---

## 2. Model sizing on a 16 GB card shared with the game

### 2.1 VRAM budget

- The machine has 16 GB VRAM, and the idle desktop uses about 3.9 GB (owner's figure). That leaves **about 12 GB for game plus LLM**.
- The game's share is unmeasured. Steam recommends 8 GB. **[estimate]** If the game takes about 8 GB, about 4 GB remains for the LLM.
- **Weights at 4-bit:**
  - Gemma 3 QAT int4 (Google): "Gemma 3 12B: Shrinks from 24 GB (BF16) to only 6.6 GB (int4) Gemma 3 4B: Reduces from 8 GB (BF16) to a lean 2.6 GB (int4) Gemma 3 1B: Goes from 2 GB (BF16) down to a tiny 0.5 GB (int4)". This counts weights only; "Running the model also requires additional VRAM for the KV cache". https://developers.googleblog.com/gemma-3-quantized-aware-trained-state-of-the-art-ai-to-consumer-gpus/
  - Gemma 4 at Q4_0 (Google table): "Gemma 4 E2B … 2.9 GB", "Gemma 4 E4B … 4.5 GB", "Gemma 4 12B … 6.7 GB". This includes "20% overhead". A trap: "While it only activates 4 billion parameters per token during generation, all 26 billion parameters must be loaded into memory" (26B A4B MoE). https://ai.google.dev/gemma/docs/core
  - 7–8B models (SpecPicks, budget math): "A 7–8B model at Q4_K_M is roughly 4.2–4.8 GB of weights, plus KV cache and runtime overhead — call it 5–6 GB resident." Also: "KV cache scales with context: a GQA 8B model costs roughly 0.5 GB per 4k tokens of context at fp16." The author says outright: "they are budget math, not measured benchmarks." https://specpicks.com/reviews/gaming-while-running-local-llm-rtx-3060-12gb-vram-contention-2026
- **[estimate]** On about 4 GB of headroom, a 4B model at int4 with a short context fits. An 8B at Q4_K_M (5–6 GB) is tight, and possible only if the game takes ≤6–7 GB.

### 2.2 Speed on RTX 40/50 cards (llama.cpp, measured, GPU alone)

llama.cpp's CUDA scoreboard (Llama 2 7B, Q4_0, 3.56 GiB). Token generation is tg128 t/s. https://github.com/ggml-org/llama.cpp/discussions/15013

| GPU | tg128 no FA | tg128 with FA | pp512 no FA |
|---|---|---|---|
| **RTX 5070 Ti 16 GB** | **176.85** | **182.43** | 6952.38 |
| RTX 5080 16 GB | 181.99 | 184.68 | 8297.36 |
| RTX 4070 Ti SUPER 16 GB | 132.26 (user post) | 132.85 | 6924.53 |
| RTX 5070 12 GB | 127.54 | 128.21 | 5184.75 |

- **Other GPU consumers cost speed, even on an idle desktop.** A user's RTX 3060 run: "With a normally-busy desktop I measured tg128 67.27 ± 1.36 (FA on); after closing host GPU consumers the same command gave 75.58 ± 0.09 — +12% and ~15x tighter variance." (same thread)
- **[estimate]** One rumour line of about 40–80 tokens takes about 0.3–0.5 s on an idle 5070 Ti with a 7–8B model, and less with a 4B. **No measurement under a running game was found.**

### 2.3 Impact on game FPS when both share the GPU

- **No measured study was found** of an external llama.cpp or Ollama process next to a running game on a 16 GB card.
- **What is documented about running out of VRAM** (SpecPicks, budget math):
  - "Exceeding 12 GB does not crash — it produces frame-time spikes from PCIe eviction and a silent tokens-per-second collapse."
  - "when the renderer needs a texture that now lives in system RAM, the frame waits."
- **Prefill and generation load the GPU differently** (SpecPicks):
  - Prefill "is compute-dense and parallel … and it saturates the GPU".
  - Generation "is memory-bandwidth-bound … and it leaves far more GPU capacity to the renderer".
  - Consequence: "a chatty back-and-forth with short prompts is nearly invisible to a running game, while a single large document paste is a visible hitch."
  - This is reasoning, not a benchmark.
- **The vendor answer is NVIGI priority scheduling** (§1.3). It needs the game's D3D queue, so an external mod process cannot simply use it. **[estimate]**
- **Unloading on demand is cheap** (Ollama FAQ): "By default models are kept in memory for 5 minutes before being unloaded." `keep_alive` "'0' … will unload the model immediately after generating a response". Also: "Parallel request processing for a given model results in increasing the context size by the number of parallel requests." https://github.com/ollama/ollama/blob/main/docs/faq.mdx

### 2.4 Russian quality of small models

| Model (Ru Arena General score) | Score |
|---|---|
| RefalMachine-RuadaptQwen2.5-7B-Lite-v1 | 88.6 |
| T-Tech-T-lite-it-1.0 | 84.98 |
| gpt-4o-mini (reference) | 83.9 |
| gemma-2-9b-it | 76.5 |
| Qwen2.5-7B-Instruct | 76.03 |
| ruadapt_qwen2.5_3B_ext_u48_instruct_v4 | 66.1 |
| google-gemma-2-2b-it | 50.55 |
| mistral-nemo-instruct-2407 | 50.52 |
| meta-llama-3-8b-instruct | 35.06 |
| Qwen2.5-1.5B-Instruct | 16.46 |
| Llama-3.2-1B-Instruct | 4.04 |

Source: https://vikhrmodels-arenahardlb.hf.space (data embedded in the page). Two caveats:

- This board covers the **2024–early-2025 generation**. Gemma 3/4 and Qwen3 are absent.
- It scores general helpfulness judged against a baseline, not prose style.

Newer models:

- **QVikhr-3-4B-Instruction** (Qwen3-4B tuned on Russian data), from its model card: "In the Ru Arena General ranking, QVikhr-3-4B-Instruction received a score of 78.2, which is a significant improvement over the base model Qwen3-4B (64.8)". GGUF is available. https://huggingface.co/Vikhrmodels/QVikhr-3-4B-Instruction
- **YandexGPT-5-Lite-8B-instruct** makes a vendor claim, in Russian. It "вплотную приблизилась к аналогам (Llama-3.1-8B-instruct и Qwen-2.5-7B-instruct) и превосходит их в ряде сценариев, в том числе — в знании русской культуры и фактов". Translation: it has come close to its peers (Llama-3.1-8B-instruct and Qwen-2.5-7B-instruct) and beats them in some scenarios, including knowledge of Russian culture and facts. A GGUF is published. https://huggingface.co/yandex/YandexGPT-5-Lite-8B-instruct
- **RuQualBench** counts LLM-typical Russian errors. Its author lists the targets: "mixed grammatical genders, characters from other alphabets, and made-up words". Findings: "Of the open models, Gemma-3-27b-it and Vistral-24B are unrivaled." "Ruadapt significantly reduces errors compared to Qwen." "Qwen3 and GPT-oss are very bad." https://huggingface.co/kristaller486 · https://github.com/kristaller486/RuQualBench
- **Mantella's own local suggestions** are Gemma 4 E4B and Gemma 3 4B (§1.1).

**Shortlist to test** (synthesis; no single source ranks these against each other in Russian):

- Gemma 3 4B QAT or Gemma 4 E4B (small, 2.6–4.5 GB)
- QVikhr-3-4B
- T-lite-it (7–8B) or RuadaptQwen2.5-7B-Lite
- YandexGPT-5-Lite-8B

**Avoid:**

- plain Llama 3.x 8B and anything 1–2B for Russian prose (arena scores 35 and below)
- base Qwen3 for Russian prose (RuQualBench)

### 2.5 Runtimes on Windows

- **llama.cpp, koboldcpp, LM Studio and Ollama** all serve an OpenAI-compatible endpoint on Windows. Mantella documents each one: "KoboldCpp http://localhost:5001/v1/ … LM Studio http://localhost:1234/v1/ Ollama http://localhost:11434/v1/". (Mantella installation page)
- **llama.cpp can force the output shape.** "GBNF (GGML BNF) is a format for defining formal grammars to constrain model outputs in llama.cpp. For example, you can use it to force the model to generate valid JSON". JSON schema works on the server too, and one caveat matters: "The JSON schema is only used to constrain the model output and is not injected into the prompt. The model has no visibility into the schema". https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md
- **vLLM on Windows was not checked** (see "What I could not find").

### 2.6 CPU-only fallback (Ryzen 7 5700G, DDR4)

- **General statements** (SpecPicks):
  - "CPU-side generation on a consumer desktop typically lands in single-digit tokens per second".
  - "CPU offload is for background and asynchronous work — a summarizer chewing through a queue, a batch job you are not waiting on."
  - "Handing four or six threads to an inference runtime while a game is trying to feed a draw-call thread trades a GPU problem for a CPU one".
- **5700G-specific (search-snippet only):**
  - OpenBenchmarking: "6.16 tokens per second on the llama-2-13b.Q4_0.gguf model". The page was behind Cloudflare and not verified; I could not confirm whether this is generation or prompt speed.
  - mikrocontroller.net: about "10 tokens/sec" for gemma-4-E2B. The page returned 403.
- **[estimate]** Generation is bound by memory bandwidth. Dual-channel DDR4-3200 gives about 51 GB/s theoretical. That caps a 4B int4 model (about 2.6 GB) at roughly 20 t/s, and an 8B Q4_K_M (about 4.8 GB) at roughly 10 t/s, before contention with the game.
- That is **too slow for on-demand speech but fine for overnight or idle pre-generation**: a 60-token line takes about 3–6 s.

---

## 3. Grounding patterns

1. **Code decides; the LLM only narrates.** PUBG Ally keeps fast play in a behaviour tree and puts language in a separate layer. Its "factual claims trace back to a value it deliberately pulled from the engine" (§1.3). For us, the journal is the only source of truth, and the LLM never writes to it.
2. **Closed vocabulary.** PUBG Ally used "a fixed item taxonomy that defines what Ally can use, what it can recognize but not use, and what doesn't exist in this context" (§1.3). For Medieval Dynasty, the fact card carries exact names of villages, people, goods and numbers, and nothing else.
3. **Code picks what is worth telling (story sifting).** Lessard et al. (FDG '26, Concordia) tell the history: James Ryan coined "story sifter"; Kreminski et al. proposed ranking by "unexpectedness" in "Select the Unexpected: A Statistical Heuristic for Story Sifting". The LLM is a bad sifter: "Researchers Méndez and Gervás experimented with ChatGPT, but this could only process a small number of events at a time and the authors were not convinced by the results". Scale of a simulation log: "61 in-game years had generated 228K unique events featured in 27K event chains". https://www.pcgworkshop.com/archive/lessard2026narrative.pdf
4. **The quality of the story material matters as much as the narrator.**
   - Lessard et al.'s prompt to GPT-4 was "do not deviate from the story outline as I have given it to you", **but** it also said "Feel free to invent story elements, including action and dialogue". That second line is exactly what we must *not* allow.
   - Results: "evaluators generally preferred human authored stories". There is also a "story-effect: that good story material might shine in spite of mediocre narrat[ion]". The theft and vengeance chains were "so poor even the human author struggled". (same PDF)
5. **Templated prompts filled from live state, and facts scoped by condition** (SkyrimNet, §1.1). A rumour about a robbed caravan reaches only NPCs in that region, or after N days.
6. **One fact, many narrators.** Caves of Qud generates sultan histories in which each event "will have both a gospel account and a corresponding tomb inscription". The tomb inscriptions "often appear to elevate praise … and sometimes omit certain shortcomings". This is distortion by narrator, with no LLM needed. https://wiki.cavesofqud.com/wiki/Sultan_history
7. **Pre-generate, then curate.** Ghostwriter produces "first drafts of barks" that writers "select and polish" (§1.3). In-game, the "curator" is an automatic validator plus a cache. Lines are generated ahead of need, so latency does not matter.
8. **Keep the prompt prefix stable and change only the tail.** PUBG Ally designed "the prompt structure to make the best use of the KV cache" (§1.3). Short prompts also keep the compute-heavy prefill small (SpecPicks, §2.3).
9. **Guardrails.** Generative Agents' typical error is invented embellishment (1.3%) (§1.3). RuQualBench lists the typical Russian errors: gender agreement, foreign alphabet, invented words (§2.4). Both can be checked **mechanically** after generation (see §4). NEO NPC adds input filters. Removing free player input removes the injection surface (Shiomi et al.).
10. **Constrain the format with a grammar** (llama.cpp GBNF / json_schema, §2.5). Output can be forced to `{"line": "...", "facts_used": [ids]}`. The model only knows the schema if the prompt describes it.

---

## 4. Synthesis — my recommendation for a Medieval Dynasty mod (**not from sources; my reasoning on them**)

**Use the LLM for** text that is shown and never fed back into the simulation:

- tavern rumours about journal events
- the herald's announcements (prices, levies, news of other villages)
- a weekly chronicle of what happened off-screen
- one-line NPC remarks tied to recent events

**Do not use the LLM for:**

- prices, stocks or production
- whether a caravan arrives or is robbed
- who dies or marries
- any decision whose number must balance
- (at first) free-text player chat. It adds injection risk, latency pressure and the "fourth wall" games (XDA). None of that is needed for a living world.

The inZOI and SkyrimNet counter-examples involve no balanced economy. Mantella's "more actions → LLMs struggle" argues against handing over decisions.

**Russian gives the LLM a specific job.** Templates in Russian break on declension and gender agreement (a masculine "ограблен" against a feminine name; noun cases after numbers: "3 овцы", "5 овец"). Paraphrasing a fact card into grammatical Russian is where a small model beats a template system. **[estimate]**

**Pipeline** (each stage simple and replaceable):

1. **Journal** (simulation, deterministic) → events with id, type, place, actors, goods, numbers, day.
2. **Sifter** (code) → chooses tellable events: rarity, consequence, distance and time from the player, and no repeats.
3. **Fact card** (code) → 5–10 fields with exact Russian names, plus a narrator role (tavern drunk, herald, chronicler, peasant) and a distortion level.
4. **LLM paraphrase** (local server, short stable prompt, 1–2 sentences, grammar-forced JSON) → N variants per card, generated ahead of time.
5. **Validator** (code):
   - every proper name and number in the output appears in the card
   - Cyrillic only
   - length limit
   - no near-duplicate of the last K lines
   - Failures are dropped.
6. **Cache** per event and per narrator → the game shows lines from the cache. If the cache is empty → **template fallback** (a plain line). The world never waits on the LLM.
7. **Scheduling:** generate while the player sleeps, sits in menus or pauses, or with the model unloaded via `keep_alive: 0` while the GPU is busy. A CPU fallback is acceptable for this offline batch.

**Minimal first experiment** (no game needed for steps A and B):

- **A. Bench without the game.**
  - Write 30 hand-made fact cards from MD-like events (caravan robbed near X, iron price up 20%, wolves took 3 sheep, wedding in Y, harvest failed).
  - Run 4 models in llama-server: Gemma 3 4B QAT or Gemma 4 E4B, QVikhr-3-4B, T-lite-it or RuadaptQwen2.5-7B-Lite, YandexGPT-5-Lite-8B.
  - Produce 5 variants per card per narrator role.
  - **Measure:**
    - (1) fact fidelity: % of lines failing the validator, with a hand check of 20 that pass
    - (2) Russian quality: owner's blind 1–5 rating of 20 lines per model, plus RuQualBench-style error count
    - (3) repetition: share of near-duplicates across 50 lines of the same event type
    - (4) speed: tokens/s and seconds per line on the GPU alone, then CPU-only
- **B. Pick one model and one prompt** from A.
- **C. Beside the game** (one atomic step at a time; close the game right after):
  - (1) game VRAM via `nvidia-smi` on the owner's settings
  - (2) frame time and 1% low over the same 60-second walk in three states: model unloaded / loaded and idle / generating in a loop. Use the NVIGI method: toggle and diff total frame time.
  - (3) tokens/s under game load
- **Pass bars** (proposed):
  - ≥95% of lines pass the validator
  - owner median ≥4 of 5
  - no visible hitch while loaded and idle
  - generation in pauses only, if a hitch shows while generating

---

## What I could not find

- **Measured FPS or frame-time impact** of an external llama.cpp or Ollama process beside a running game on a 12–16 GB RTX 40/50 card. Only budget math (SpecPicks) and one unverified inZOI forum anecdote exist.
- **Medieval Dynasty's real VRAM use**: only the Steam spec (8 GB recommended).
- **A current, single-scale Russian ranking of ≤8B models** including Gemma 3/4, Qwen3, YandexGPT-5-Lite, T-lite 2 and QVikhr-3. Ru Arena General covers the older generation. RuQualBench's README shows no small-model table.
- **Verified CPU-only numbers for a Ryzen 7 5700G.** OpenBenchmarking was behind Cloudflare and mikrocontroller.net returned 403; the figures are search snippets only.
- **Player opinions from Reddit or Nexus comments** on Mantella, CHIM or SkyrimNet. Reddit and Nexus block scripted access. I used press articles and GitHub issues instead.
- **Suck Up!'s model and latency**; Whispers from the Star's latency. The Steam pages confirm only that an internet connection is needed.
- **CHIM/Herika latency and VRAM figures.** They are not in the README.
- **"AI Influence" (Bannerlord) details** from the page itself (Nexus 403). Search snippet only.
- **Inworld's move away from games**: aiwiki snippet only.
- **vLLM on Windows**: not checked. llama.cpp, Ollama, LM Studio and koboldcpp are documented as working (Mantella).
- **Any LLM mod for Medieval Dynasty**: none exists (Nexus API, 73 mods, 2026-10-08).

---

## Essence (Pareto)

Each line gives the mechanism · why it scales · who proved it.

1. **The LLM speaks, code decides** · economy correctness never depends on a model; the LLM can be swapped or switched off · PUBG Ally's System 1 behaviour tree and System 2 speech (developer.nvidia.com KRAFTON interview).
2. **One fact card in, one short line out** · each call is small and independent; short prefill means little GPU stress; scales with lines shown, not with world size · PUBG Ally "factual claims trace back to a value … pulled from the engine"; SpecPicks on prefill and generation.
3. **Code chooses what is worth telling (story sifting)** · the LLM never reads the whole journal; cost grows with what is shown, not with 228K events · Kreminski "Select the Unexpected"; Lessard et al. 2026; the LLM failed as a sifter (Méndez & Gervás, cited by Lessard).
4. **Pre-generate into a cache, with template fallback** · latency becomes irrelevant; GPU work moves into pauses; the world never waits · Ubisoft Ghostwriter (drafts generated ahead, then curated); Ollama `keep_alive` unload.
5. **Same fact, many narrators** · variety without new facts, and hence no new contradictions · Caves of Qud gospel and tomb accounts of each event.
6. **A mechanical validator after generation** (names and numbers ⊆ card; Cyrillic only; dedupe) · catches the ~1% embellishments at no cost per line · Generative Agents' 1.3% hallucinated; RuQualBench error classes.
7. **A small model with a stable prompt prefix** · KV-cache reuse; fits beside a heavy game · PUBG Ally 2B in 8 GB total VRAM; inZOI 0.5B.
8. **A closed vocabulary of names, goods and places** · the model cannot mention what does not exist · PUBG Ally fixed item taxonomy.
9. **No free player text at first** · removes prompt injection and fourth-wall breaking as failure classes · Shiomi et al. 2025; NEO NPC input filters; XDA anecdote.

### Over-engineering traps the sources warn about

- **A full generative agent per NPC** (memory stream, reflection, planning): "costing thousands of dollars in token credits" for 25 agents over two days (Park et al.).
- **Using the LLM as the event sifter** over a big log: it "could only process a small number of events at a time" (Méndez & Gervás via Lessard).
- **Handing the LLM many actions or decisions:** "The more actions that are enabled, the more LLMs will struggle" (Mantella).
- **A lore fine-tune:** Mantella's Skyrim fine-tune is "now very outdated and performs worse than newer, non fine-tuned models".
- **A real-time voice stack** (STT + LLM + TTS + lip sync) for ambient speech. Each stage costs about 0.5 s (Mantella real-time page), and none of it is needed for rumours, which are read or shown.
- **Many cooperating processes:** "This introduces latency, a considerable amount of system load, and many sources of bugs/issues" (SkyrimNet). For pre-generation, one local server is enough.
- **Big models or long prompts while gaming:** "Above 13B at Q4_K_M you are out of headroom". "a single large document paste is a visible hitch" (SpecPicks).
- **Per-NPC vector memory and embeddings** (SkyrimNet-style) before the basic rumour loop has proved itself. **[my inference]**
- **Cloud dependence:** surprise bills (Vaudeville, Inworld Calradia) and network latency (PUBG Ally rejected cloud).

---

## Sources

- Mantella docs: https://art-from-the-machine.github.io/Mantella/ · https://art-from-the-machine.github.io/Mantella/pages/installation.html · https://art-from-the-machine.github.io/Mantella/pages/real_time_npcs.html · https://art-from-the-machine.github.io/Mantella/pages/fine_tuned_models.html
- Mantella issues: https://github.com/art-from-the-machine/Mantella/issues/67 · https://github.com/art-from-the-machine/Mantella/issues/640
- CHIM server: https://github.com/Dwemer-Dynamics/HerikaServer
- SkyrimNet: https://github.com/MinLL/SkyrimNet-GamePlugin
- XDA: https://www.xda-developers.com/i-used-mods-to-bring-ai-powered-npcs-to-skyrim/
- UploadVR: https://www.uploadvr.com/playing-skyrim-vr-with-chatgpt-powering-npc-conversations/
- Inworld Calradia: https://exputer.com/news/games/mount-and-blade-2-bannerlord-mod/
- AI Influence (snippet): https://catalogue.smods.ru/archives/402946
- NVIDIA SLM / Mecha BREAK: https://blogs.nvidia.com/blog/ai-decoded-gamescom-ace-nemotron-instruct
- NVIDIA inZOI / NARAKA: https://www.nvidia.com/en-gb/geforce/news/nvidia-ace-naraka-bladepoint-inzoi-launch-this-month/
- KRAFTON PUBG Ally interview: https://developer.nvidia.com/blog/how-krafton-built-pubg-ally-a-co-playable-character-powered-by-nvidia-ace/
- PUBG Ally beta: https://www.nvidia.com/en-us/geforce/news/pubg-ally-ai-teammate-beta-available-now/
- NVIGI GPU scheduling: https://docs.nvidia.com/nvigi-sdk/1.6.0/docs/nvigi_core/docs/GpuSchedulingForAI.html
- Ubisoft NEO NPC: https://news.ubisoft.com/en-us/article/5qXdxhshJBXoanFZApdG3L
- Ubisoft Ghostwriter: https://news.ubisoft.com/en-us/article/7Cm07zbBGy4Xml6WgYi25d/the-convergence-of-ai-and-creativity-introducing-ghostwriter
- Vaudeville pre-mortem: https://www.gamedeveloper.com/design/vaudeville-pre-mortem
- Vaudeville offline engine: https://www.gamedeveloper.com/press-release/bumblebee-presents-its-new-offline-smart-npcs-engine
- Vaudeville preview: https://keengamer.com/articles/previews/vaudeville-preview-the-ai-questioning-to-nowhere/
- Steam pages: https://store.steampowered.com/app/2240920/Vaudeville · https://store.steampowered.com/app/2726370/Suck_Up/ · https://store.steampowered.com/app/3730100/ · https://store.steampowered.com/app/1129580/
- Generative Agents: https://arxiv.org/abs/2304.03442 · https://arxiv.org/html/2304.03442
- NPC prompt injection: https://arxiv.org/abs/2508.19288
- Story sifting (Lessard et al.): https://www.pcgworkshop.com/archive/lessard2026narrative.pdf
- Caves of Qud sultan histories: https://wiki.cavesofqud.com/wiki/Sultan_history
- llama.cpp CUDA scoreboard: https://github.com/ggml-org/llama.cpp/discussions/15013
- llama.cpp GBNF: https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md
- Ollama FAQ: https://github.com/ollama/ollama/blob/main/docs/faq.mdx
- SpecPicks: https://specpicks.com/reviews/gaming-while-running-local-llm-rtx-3060-12gb-vram-contention-2026
- Gemma 3 QAT: https://developers.googleblog.com/gemma-3-quantized-aware-trained-state-of-the-art-ai-to-consumer-gpus/
- Gemma docs: https://ai.google.dev/gemma/docs/core
- Ru Arena General: https://vikhrmodels-arenahardlb.hf.space
- QVikhr-3-4B: https://huggingface.co/Vikhrmodels/QVikhr-3-4B-Instruction
- YandexGPT-5-Lite-8B: https://huggingface.co/yandex/YandexGPT-5-Lite-8B-instruct
- RuQualBench: https://huggingface.co/kristaller486 · https://github.com/kristaller486/RuQualBench
- Nexus Mods GraphQL API: https://api-router.nexusmods.com/graphql (queried 2026-10-08 00:22)
