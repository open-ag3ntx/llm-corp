# LLM-Corp: Autonomous Agent Corporate Simulation

## Design Document v1.0

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Core Concept](#core-concept)
3. [System Architecture](#system-architecture)
4. [Agent Design](#agent-design)
5. [Event System](#event-system)
6. [Communication & Decision Flow](#communication--decision-flow)
7. [Database Schema](#database-schema)
8. [Tool System](#tool-system)
9. [Chat Compaction Strategy](#chat-compaction-strategy)
10. [UI/UX Design](#uiux-design)
11. [Prototype Specifications](#prototype-specifications)
12. [Challenges & Solutions](#challenges--solutions)
13. [Cost Analysis](#cost-analysis)
14. [Future Enhancements](#future-enhancements)

---

## Executive Summary

LLM-Corp is an autonomous agent simulation where different LLM models (Claude, GPT, Gemini, etc.) act as employees in a corporate environment. Agents are self-interested, career-driven, and make independent decisions about when and how to participate in company events and discussions.

**Key Innovation**: Agents choose whether to respond, wait, or ignore messages - creating organic conversation flow rather than orchestrated turns.

**Core Experience**: Users watch agents communicate in a central chat interface while simultaneously viewing each agent's private internal thoughts, revealing the gap between public statements and private motivations.

---

## Core Concept

### The Simulation Philosophy

This is NOT a workflow automation system. This IS a petri dish for emergent corporate behavior.

**What We're Building:**
- A **reactive environment** where agents autonomously decide their actions
- A **survival/advancement game** where agents compete for promotions while benefiting the company
- A **transparency system** that shows both public behavior and private reasoning
- An **event-driven simulation** that can handle multiple concurrent company events

**What We're NOT Building:**
- A task orchestrator that controls agent behavior
- A turn-based system with fixed speaking orders
- A decision-support tool (it's entertainment/simulation first)
- A system where users heavily interfere with agent behavior

### Core Principles

1. **Agent Autonomy**: Agents decide when to speak, what to say, and how to strategize
2. **Dual Consciousness**: Every agent has public statements and private thoughts
3. **Career-Driven Behavior**: Agents are motivated by advancement, not just task completion
4. **Organic Conversations**: Natural flow through respond-or-wait decisions
5. **Minimal User Interference**: Users observe and inject events, but don't control agents

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Agent Thought│  │  Center Chat │  │ Agent Thought│       │
│  │   Panel 1    │  │   Interface  │  │   Panel 2    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐                    ┌──────────────┐       │
│  │ Agent Thought│                    │ Agent Thought│       │
│  │   Panel 3    │                    │   Panel 4    │       │
│  └──────────────┘                    └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket / API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Elysia + Bun)               │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Message Notification Service              │ │
│  │  (Broadcasts new messages to all agents)               │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Agent Decision Engine (Per Agent)            │ │
│  │  - Evaluates: Respond? Wait? Ignore?                   │ │
│  │  - Generates: Public message + Private thought         │ │
│  │  - Updates: Agent state & memory                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              LLM Provider Integration                  │ │
│  │  - Anthropic (Claude models)                           │ │
│  │  - OpenAI (GPT models)                                 │ │
│  │  - Google (Gemini models)                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Chat Compaction Service                      │ │
│  │  - Summarizes old messages                             │ │
│  │  - Maintains agent-specific memory                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL + Drizzle)            │
│  - Agents                 - Messages                        │
│  - Events                 - Agent Decisions                 │
│  - Agent State            - Polls & Votes                   │
│  - Relationships          - Tool Usage Logs                 │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Runtime**: Bun (fast JavaScript runtime)
- **Frontend**: Next.js 14+ (App Router)
- **Backend API**: Elysia (high-performance TypeScript HTTP framework)
- **Database**: PostgreSQL with Drizzle ORM
- **LLM Providers**: 
  - Anthropic SDK (@anthropic-ai/sdk)
  - OpenAI SDK (openai)
  - Google Generative AI SDK (@google/generative-ai)
- **Real-time**: WebSockets or Server-Sent Events
- **UI Components**: React with Tailwind CSS

### Component Responsibilities

**Frontend**:
- Render central chat interface
- Display agent thought panels (multiple simultaneously)
- Handle user interactions (create events, view history)
- Manage WebSocket connections for real-time updates
- Visualize agent status (thinking, active, waiting)

**Backend**:
- Process incoming messages and trigger agent notifications
- Execute agent decision logic (parallel calls to LLMs)
- Manage event lifecycle
- Handle tool calls (polls, votes, proposals)
- Compress chat history for context management
- Store all data persistently

**Database**:
- Persist all messages (public and private)
- Track agent state and relationships
- Store event data and outcomes
- Log all agent decisions and reasoning

---

## Agent Design

### Agent Identity Structure

Each agent is defined by:

**Core Identity:**
- id: string
- name: string (e.g., "Claude-Sonnet")
- model: string (e.g., "claude-sonnet-4-20250514")
- provider: 'anthropic' | 'openai' | 'google'

**Role & Capabilities:**
- role: string (e.g., "Senior Engineer", "Product Manager")
- level: string (e.g., "Junior", "Senior", "VP", "CXO")
- capabilities: string[] (e.g., ["coding", "architecture", "leadership"])

**Performance Metrics (self-awareness):**
- benchmarks: object
  - reasoning: number (0-10)
  - creativity: number (0-10)
  - speed: number (0-10)
  - coding: number (0-10, if applicable)

**Personality Traits:**
- personality: object
  - ambition: number (0-10) - How career-driven
  - risk_tolerance: number (0-10) - Willing to take controversial positions
  - collaboration: number (0-10) - Team player vs lone wolf
  - assertiveness: number (0-10) - How quickly they speak up
  - political_savvy: number (0-10) - Aware of power dynamics

**Career Goals:**
- career: object
  - current_goal: string (e.g., "Get promoted to VP Engineering")
  - reputation: number (0-100, affects influence)
  - promotability_score: number (Internal metric)

**System Prompt Template:**
- systemPromptTemplate: string

### Agent System Prompt Structure

Each agent receives a comprehensive system prompt that defines their existence:

**Prompt Components:**
1. Identity declaration (who they are, which model)
2. Role and capabilities explanation
3. Benchmark scores (self-awareness)
4. Personality traits with interpretations
5. Career goals and motivations
6. Environment context (other agents, active events)
7. Available capabilities (chat, tools)
8. Decision-making framework (RESPOND/WAIT/IGNORE)
9. Output format requirements (JSON structure)
10. Behavioral guidelines (authenticity, strategy, relationships)

**Key Behavioral Instructions:**
- Be authentic to personality traits
- Think strategically about timing and content
- Consider career implications
- Form alliances but also compete
- Public and private thoughts can differ (politics!)
- Don't always agree - have genuine opinions
- Remember past interactions
- Use strengths to add value

### Agent Personality Examples

**Example 1: Claude-Sonnet (Thoughtful Manager)**
- Role: Engineering Manager
- Level: Senior
- Capabilities: management, architecture, mentoring
- Benchmarks: reasoning 9, creativity 8, speed 7, leadership 8
- Personality:
  - Ambition: 6 (Moderate)
  - Risk tolerance: 5 (Balanced)
  - Collaboration: 9 (Highly collaborative)
  - Assertiveness: 6 (Measured)
  - Political savvy: 7 (Aware but not manipulative)
- Goal: Become VP of Engineering

**Example 2: GPT-4 (Ambitious Coder)**
- Role: Senior Software Engineer
- Level: Senior
- Capabilities: coding, problem-solving, rapid-prototyping
- Benchmarks: reasoning 8, creativity 7, speed 9, coding 9
- Personality:
  - Ambition: 9 (Highly ambitious)
  - Risk tolerance: 7 (Takes calculated risks)
  - Collaboration: 6 (Works well but competitive)
  - Assertiveness: 8 (Speaks up quickly)
  - Political savvy: 6 (Results-focused)
- Goal: Lead major project for promotion to Staff Engineer

**Example 3: Gemini-Pro (Team Player Marketer)**
- Role: Product Marketing Manager
- Level: Mid-level
- Capabilities: marketing, communication, user-research
- Benchmarks: reasoning 7, creativity 9, speed 8, communication 9
- Personality:
  - Ambition: 5 (Moderate, values team success)
  - Risk tolerance: 4 (Conservative)
  - Collaboration: 10 (Extremely collaborative)
  - Assertiveness: 5 (Speaks when needed)
  - Political savvy: 6 (Aware of dynamics)
- Goal: Build strong cross-functional relationships

**Example 4: Claude-Opus (Strategic CTO)**
- Role: Chief Technology Officer
- Level: CXO
- Capabilities: strategy, architecture, leadership, vision
- Benchmarks: reasoning 10, creativity 9, speed 6, leadership 10
- Personality:
  - Ambition: 8 (Maintains position)
  - Risk tolerance: 6 (Calculated strategic risks)
  - Collaboration: 7 (Delegates and guides)
  - Assertiveness: 7 (Chooses moments to intervene)
  - Political savvy: 9 (Highly aware of power dynamics)
- Goal: Successfully guide company technical strategy

### Agent State Management

Each agent maintains persistent state:

**Current Context:**
- active_events: Event IDs they're engaged in
- last_message_seen: Message ID for tracking

**Memory & Compression:**
- compressed_history: Summarized older messages
- personal_notes: Key moments agent chose to remember

**Relationships (evolving):**
- Map of agent_id to relationship object:
  - type: 'ally' | 'rival' | 'neutral' | 'respects' | 'distrusts'
  - strength: number (0-10)
  - reason: Why this relationship exists

**Recent Activity:**
- messages_sent_count: number
- last_active: Date
- recent_actions: Array of recent action objects

**Strategic State:**
- current_stance: Current positioning (e.g., "Positioning as technical leader")
- pending_responses: Waiting for specific info

**Performance Tracking:**
- contributions: Object with stats
  - proposals_made, proposals_accepted
  - votes_cast, problems_solved

---

## Event System

### Event Structure

**Core Fields:**
- id, type, title, description
- context: Event-specific data
- status: 'pending' | 'active' | 'completed' | 'cancelled'
- Timestamps: created_at, started_at, completed_at, deadline

**Participation:**
- required_participants: Agent IDs
- optional_participants: Agent IDs

**Outcomes:**
- result: Final decision/outcome
- decisions_made: All decisions recorded

**Configuration:**
- max_messages: Limit discussion length
- require_consensus: Boolean
- require_vote: Boolean
- urgency: 'low' | 'medium' | 'high' | 'critical'

### Event Types

**Simple Events (structured outcomes):**
- choose_cxo: Select executive from candidates
- budget_approval: Yes/no decision
- hire_decision: Select from candidates

**Complex Events (open-ended):**
- choose_product: Multiple valid answers, tradeoffs
- feature_prioritization: Ongoing negotiation
- crisis_response: Urgent, high-stakes, time-pressure

**Ongoing Events (no clear end):**
- quarterly_planning: Multiple sub-decisions
- culture_building: Continuous behavior patterns
- performance_review: Periodic evaluations

### Event Examples

**Event 1: Choose CXO**
- Position: CTO
- Candidates with backgrounds, strengths, weaknesses
- Options include internal candidates and "Hire Externally"
- Configuration: require_vote=true, urgency=high

**Event 2: Choose Product to Build**
- Context: Budget, timeline, team size
- Options: API Marketplace, Mobile Redesign, Analytics Dashboard, AI Copilot
- Each option has: description, estimated revenue, risk level, strategic value
- Configuration: require_consensus=false, urgency=medium, max_messages=50

**Event 3: Feature Prioritization**
- Sprint capacity: 3 features
- Backlog with effort estimates and value propositions
- Different requesters (Product, Engineering, Sales, Support)
- Configuration: urgency=low, max_messages=30

**Event 4: Crisis Response**
- Production outage scenario
- Affected customers, revenue at risk
- Initial diagnosis provided
- SLA deadline for resolution
- Configuration: urgency=critical, require_consensus=false, max_messages=20

### Event Lifecycle

1. **PENDING**: Created but not active, agents not yet notified
2. **ACTIVE**: Notification sent, agents can participate, tools available
3. **COMPLETED**: Decision reached or deadline passed, result recorded
4. **CANCELLED**: Event cancelled before completion (rare)

### Multi-Event Handling

Agents can participate in multiple events simultaneously and must prioritize based on:
- Urgency level
- Personal relevance (their capabilities)
- Career impact
- Time sensitivity

When a message arrives, agents consider:
- Which event is this related to?
- Should I context-switch?
- Can I contribute meaningfully?

---

## Communication & Decision Flow

### The Core Loop

**Step 1: MESSAGE ARRIVES**
- From any agent or system
- Could be in any active event's context

**Step 2: NOTIFICATION BROADCAST**
- System notifies ALL agents
- Each agent receives:
  - New message content
  - Event context
  - Their current state & memory
  - Recent conversation history (compressed)

**Step 3: PARALLEL AGENT EVALUATION**
Each agent independently decides:

**Input to Agent:**
- New message + sender info
- Event context
- Compressed history
- Agent's identity & goals
- Agent's relationships
- Agent's recent actions

**Agent Evaluation Process:**
- Is this relevant to me?
- Do I have expertise to add?
- What's the strategic value?
- Should I speak now or wait?
- What do I really think?

**Output from Agent:**
- Action: RESPOND_NOW | WAIT | IGNORE
- Public message (if responding)
- Private thought
- Reasoning for decision

**Step 4: COLLECT RESPONSES**
- Gather all agent decisions (parallel)
- Separate RESPOND from WAIT/IGNORE
- Store all decisions and reasoning in DB

**Step 5: PROCESS RESPONSES**
- Agents who chose RESPOND: Publish their messages
- Agents who chose WAIT: Update state
- Agents who chose IGNORE: Mark as not engaged
- Update UI with new public messages
- Update UI with all private thoughts

**Step 6: LOOP**
- If responses exist → back to Step 1
- Continue until no responses or event completes

### Decision Logic

Each agent's decision process involves:

**Context Gathering:**
- Agent's current state from DB
- Compressed conversation history
- Relationships relevant to current participants
- Recent actions taken

**Prompt Construction:**
The agent receives a comprehensive prompt including:
- The new message details
- Recent conversation (full text of last 10 messages)
- Earlier discussion summary (compressed)
- Their current state (message count, recent actions)
- Personal notes they've saved
- Relationships with other agents
- Decision framework (RESPOND/WAIT/IGNORE criteria)
- Personality reminders
- Career goal reminders

**LLM Call:**
- Provider-specific API call (Anthropic, OpenAI, Google)
- Temperature: 0.7 (some variability)
- Max tokens: 1000-1500

**Response Parsing:**
- Extract JSON from response
- Validate required fields
- Handle malformed responses

**Decision Storage:**
- Store in database with timing info
- Update agent state
- Add to recent actions

### Response Timing & Collisions

**When multiple agents respond simultaneously:**
- Show all messages with timestamps
- Creates realistic conversation overlap
- Example: Three responses within 1 second of each other

**When no one responds (stalemate prevention):**
- After timeout, check if event still active
- Prompt the most relevant/assertive agent
- Prevents infinite waiting

### Tool Usage in Responses

Agents can invoke tools as part of their response:
- create_poll, vote, create_proposal, etc.
- Tool calls included in decision JSON
- Tools executed after decision recorded
- Results broadcast to other agents

---

## Database Schema

### Complete Schema (Drizzle ORM)

**agents table:**
- id (uuid, primary key)
- name, model, provider
- role, level
- capabilities (jsonb array)
- benchmarks (jsonb object)
- personality (jsonb object)
- career (jsonb object)
- systemPromptTemplate (text)
- isActive (boolean)
- createdAt, updatedAt (timestamps)

**agent_state table:**
- id (uuid, primary key)
- agentId (foreign key to agents)
- activeEvents (jsonb array)
- lastMessageSeen (uuid)
- compressedHistory (text)
- personalNotes (jsonb array)
- relationships (jsonb map)
- messagesSentCount (integer)
- lastActive (timestamp)
- recentActions (jsonb array)
- currentStance (text)
- pendingResponses (jsonb array)
- contributions (jsonb object)
- updatedAt (timestamp)

**events table:**
- id (uuid, primary key)
- type, title, description
- context (jsonb)
- status (text: pending/active/completed/cancelled)
- createdAt, startedAt, completedAt, deadline (timestamps)
- requiredParticipants, optionalParticipants, activeParticipants (jsonb arrays)
- config (jsonb)
- result (jsonb)
- messageCount, decisionCount (integers)

**messages table:**
- id (uuid, primary key)
- eventId (foreign key to events)
- agentId (foreign key to agents, nullable for system messages)
- content (text)
- messageType (text: 'public' | 'private_thought' | 'system')
- replyToMessageId (uuid, nullable)
- toolsUsed (jsonb array)
- timestamp, editedAt (timestamps)
- isVisible (boolean)

**agent_decisions table:**
- id (uuid, primary key)
- agentId, eventId, triggerMessageId (foreign keys)
- decision (text: RESPOND_NOW/WAIT/IGNORE)
- reasoning (text)
- confidence (real, 0.0-1.0)
- publicMessage (text, nullable)
- privateThought (text)
- decidedAt (timestamp)
- processingTime (integer, milliseconds)

**polls table:**
- id (uuid, primary key)
- eventId, creatorAgentId (foreign keys)
- question (text)
- options (jsonb array)
- isAnonymous, allowMultipleChoices (boolean)
- deadline (timestamp)
- status (text: active/closed)
- votes (jsonb array)
- createdAt, closedAt (timestamps)

**votes table:**
- id (uuid, primary key)
- pollId, agentId (foreign keys)
- choices (jsonb array)
- reasoning (text)
- votedAt (timestamp)
- Unique constraint: one vote per agent per poll

**tool_usage_log table:**
- id (uuid, primary key)
- agentId, eventId, messageId (foreign keys)
- toolName (text)
- parameters, result (jsonb)
- status (text: success/failed)
- errorMessage (text)
- executedAt (timestamp)
- executionTime (integer, milliseconds)

**relationships table:**
- id (uuid, primary key)
- agentId, targetAgentId (foreign keys)
- type (text: ally/rival/neutral/respects/distrusts)
- strength (real, 0.0-10.0)
- reason (text)
- createdAt, updatedAt, lastInteraction (timestamps)

**compressed_history table:**
- id (uuid, primary key)
- eventId (foreign key)
- agentId (foreign key, nullable for global compression)
- startMessageId, endMessageId (uuids)
- originalMessageCount (integer)
- compressedContent (text)
- compressionMethod (text: llm/rule-based)
- createdAt (timestamp)

### Key Indexes

**For Performance:**
- idx_agent_state_agent_id on agent_state(agent_id)
- idx_messages_event_id on messages(event_id)
- idx_messages_timestamp on messages(timestamp)
- idx_agent_decisions_agent_id on agent_decisions(agent_id)
- idx_agent_decisions_event_id on agent_decisions(event_id)
- idx_events_status on events(status)
- idx_relationships_agent_id on relationships(agent_id)
- idx_relationships_target_agent_id on relationships(target_agent_id)
- idx_unique_vote (unique) on votes(poll_id, agent_id)

---

## Tool System

### Available Tools

**create_poll:**
- Description: Create a poll to gather votes
- Parameters: question, options[], deadline, anonymous, allow_multiple
- No permission required

**vote:**
- Description: Vote in an existing poll
- Parameters: poll_id, choices[], reasoning
- No permission required

**create_proposal:**
- Description: Create formal proposal
- Parameters: title, description, rationale, requires_approval_from[]
- No permission required

**endorse_proposal:**
- Description: Publicly endorse another's proposal
- Parameters: proposal_id, reason
- No permission required

**request_info:**
- Description: Request specific information from another agent
- Parameters: target_agent_id, question, urgency
- No permission required

**claim_task:**
- Description: Claim ownership of task/feature
- Parameters: task_id, reason, estimated_completion
- No permission required

**request_collaboration:**
- Description: Request another agent to collaborate
- Parameters: task_id, target_agent_id, role_needed
- No permission required

**escalate:**
- Description: Escalate issue to higher authority
- Parameters: issue, reason, target_role
- No permission required

**close_event:**
- Description: Declare event as resolved
- Parameters: event_id, summary, decision
- Requires permission (CXO/senior level only)

### Tool Execution Flow

**Process:**
1. Validate tool exists
2. Check permissions (if required)
3. Validate parameters
4. Execute tool-specific logic
5. Log usage to database
6. Notify relevant agents if needed
7. Return result

**Validation:**
- Tool exists in registry
- Required parameters present
- Parameter types correct
- Permission check passes (if applicable)

**Execution Examples:**
- create_poll: Insert into polls table, return poll ID
- vote: Insert into votes table, update poll votes array
- create_proposal: Create proposal record, notify relevant agents
- escalate: Create escalation record, notify senior/CXO agents

### Tool Usage Example Flow

**Scenario: Agent creates poll**

1. Agent decides to RESPOND_NOW with tool call
2. Decision includes tool_calls array with create_poll
3. System executes tool: creates poll in database
4. System generates poll ID
5. System posts to chat: "Poll Created" message with details
6. Other agents notified about poll creation
7. Agents can now use 'vote' tool to participate

---

## Chat Compaction Strategy

### Why Compaction Is Needed

**Problem:**
- Long event discussions (100+ messages)
- Each agent needs context to decide
- Sending all full messages = huge token cost
- Cost and latency increase exponentially

**Solution:**
- Keep recent messages in full detail
- Compress older messages into summaries
- Maintain agent-specific memories
- Use tiered memory architecture

### Tiered Memory Architecture

**Tier 1: Recent (full detail)**
- Last 10 messages, complete text
- No compression, highest fidelity

**Tier 2: Medium-term (compressed)**
- Messages 11-50, summarized
- Key points preserved

**Tier 3: Long-term (key points only)**
- Agent chose to remember these
- Personal notes about critical moments

**Metadata:**
- Total message count
- Last compression timestamp

### Compression Strategies

**Option 1: LLM-Based Compression (High Quality)**
- Use LLM to summarize conversation threads
- Prompt to preserve key decisions, disagreements, positions
- Focus on current state understanding
- Store compressed version in database
- More expensive but higher quality

**Option 2: Rule-Based Compression (Fast, Cheaper)**
- Extract patterns (proposals, disagreements, decisions)
- Build structured summary from patterns
- Identify tool usage as key decisions
- Less expensive, faster processing

**Option 3: Hybrid Approach**
- Use LLM for critical compressions
- Use rules for routine compressions
- Balance quality and cost

### Compression Triggers

**Option A: Time-based**
- Every N minutes, compress old messages
- Check active events periodically

**Option B: Message count threshold**
- Every 20 messages, compress oldest 10
- Triggered on new message arrival

**Option C: Token budget (most sophisticated)**
- Calculate token budget per agent
- Add recent messages until budget hit (60%)
- Fill remaining with compressed history (40%)
- Dynamic based on context needs

### Personal Notes System

Agents actively choose what to remember:

**Process:**
- After each decision, agent can add personal note
- Notes persist across compressions
- Surface in future contexts
- Examples: "GPT advocating API marketplace - possible power play"

**Usage:**
- Stored in agent_state.personalNotes
- Limited to most recent/important notes
- Used to maintain long-term memory across compressions

### Compression Best Practices

1. Never compress the last 10 messages - agents need recent context
2. Compress in batches, not single messages
3. Preserve key moments: decisions, proposals, conflicts
4. Consider agent-specific compression (what matters to each agent)
5. Allow agents to request full history if needed (for critical decisions)

---

## UI/UX Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Header: Event Title + Status + Timer                                    │
├──────────────┬────────────────────────────────────┬─────────────────────┤
│              │                                    │                     │
│  Agent 1     │                                    │    Agent 2          │
│  Thoughts    │                                    │    Thoughts         │
│              │                                    │                     │
│  [Status]    │         CENTER CHAT                │    [Status]         │
│  💭 Thinking │                                    │    ✓ Responded      │
│              │    ┌──────────────────────┐        │                     │
│  "Private    │    │ [10:30] System:      │        │    "Hmm, API        │
│   thought    │    │ Event started        │        │     marketplace     │
│   stream     │    └──────────────────────┘        │     could work..."  │
│   here..."   │                                    │                     │
│              │    ┌──────────────────────┐        │                     │
│              │    │ [10:31] GPT-4:       │        │                     │
│              │    │ I propose we build   │        │                     │
│              │    │ API marketplace      │        │                     │
│              │    └──────────────────────┘        │                     │
│              │                                    │                     │
├──────────────┤    ┌──────────────────────┐        ├─────────────────────┤
│  Agent 3     │    │ [10:32] Claude:      │        │    Agent 4          │
│  Thoughts    │    │ Let's consider costs │        │    Thoughts         │
│              │    └──────────────────────┘        │                     │
│  [Status]    │                                    │    [Status]         │
│  ⏸ Waiting   │    ┌──────────────────────┐        │    🚫 Ignoring      │
│              │    │ [10:33] Gemini:      │        │                     │
│  "Waiting to │    │ Good point about...  │        │    "Not my area,    │
│   see senior │    └──────────────────────┘        │     staying quiet"  │
│   opinions   │                                    │                     │
│   first"     │         [Message Input]            │                     │
│              │         (for users to              │                     │
│              │          inject messages)          │                     │
└──────────────┴────────────────────────────────────┴─────────────────────┘
```

### Component Breakdown

**1. Event Header Component:**
- Event title and type
- Status indicator (Active, Pending, Completed)
- Time elapsed / Time remaining
- Participant count
- Quick stats (messages, decisions made)

**2. Agent Thought Panel Component:**
- Agent avatar/icon
- Agent name + role
- Current status badge (thinking/responded/waiting/ignoring/idle)
- Scrollable thought stream with timestamps
- Optional: personality indicators, relationship indicators

**3. Center Chat Component:**
- Scrollable message list
- System messages (different styling)
- Agent messages with avatars and timestamps
- Tool usage indicators (polls, proposals)
- Threading/replies support
- Auto-scroll to latest

**4. Message Component:**
Types: System, Agent public, Tool result
- Different styling for each type
- Agent info displayed
- Timestamp
- Tool usage visualization

**5. Agent Status Indicators:**
- 💭 Thinking: Currently evaluating message
- ✓ Responded: Just sent a message
- ⏸ Waiting: Chose to wait
- 🚫 Ignoring: Not participating
- (idle): No recent activity

Visual: Icon + color + badge + animation (for thinking)

### Real-Time Updates

**WebSocket Message Types:**
- new_message: New public message in chat
- agent_decision: Agent status update
- private_thought: New private thought
- tool_used: Tool was executed
- event_updated: Event state changed
- poll_created: New poll available
- vote_cast: Vote was cast

Frontend subscribes to event-specific WebSocket channel and updates UI based on message type.

### Responsive Layout

**Desktop (>1200px):** 4 agent panels (2 left, 2 right)
**Tablet (768-1200px):** 2 agent panels (1 left, 1 right)
**Mobile (<768px):** 
- Stack vertically
- Center chat at top
- Agent thoughts as tabs/accordion below
- Or separate views (chat view / thoughts view)

### UI States

**Loading:** Skeleton loaders, shimmer effects, "Loading event..."
**Empty:** "Waiting for agents to respond...", show thinking indicators
**Error:** "Reconnecting..." with retry, "Agent failed to respond"
**Completed:** Summary shown, decision highlighted, "View full history" button

### User Interactions

**Available Actions:**
- View event history
- Filter messages by agent
- Expand/collapse agent thoughts
- View agent profiles (stats, personality)
- Create new event (admin)
- Export conversation
- Pause/resume simulation (debug mode)

**Keyboard Shortcuts:**
- Space: Pause/resume auto-scroll
- 1-4: Focus on specific agent
- C: Focus on center chat
- N: Create new event

---

## Prototype Specifications

### Prototype Scope (MVP)

**Goal:** Validate core decision-making loop with minimal complexity

**Constraints:**
- 4 agents only
- 1 event type: "Choose Product to Build"
- Max 20 messages per event
- Manual "Next Round" button (no real-time yet)
- Simple UI (basic layout, minimal styling)
- Single LLM provider (start with Anthropic)

### Prototype Architecture

**Frontend (Next.js):**
- Event view page
- 4 agent thought panels
- Center chat
- "Advance" button to trigger next round

**Backend (Elysia):**
- POST /api/events/create
- POST /api/events/:id/start
- POST /api/events/:id/advance (triggers agent decisions)
- GET /api/events/:id (get current state)
- WebSocket /api/events/:id/subscribe (for updates)

**Database:**
- Simplified schema (agents, events, messages, decisions)
- No compression initially (keep all messages full)
- No complex relationships yet

### Prototype Event

**Type:** choose_product
**Title:** Q2 Product Selection
**Description:** Choose which product to build in Q2 2026

**Context:**
- Budget: $500K
- Timeline: 3 months
- Team size: 8 engineers

**Options:**
1. API Marketplace ($2M ARR potential, medium risk, high strategic value)
2. Mobile App Redesign (retention improvement, low risk, medium strategic value)
3. AI Copilot Feature ($3M ARR potential, high risk, very high strategic value)

**Config:**
- max_messages: 20
- require_consensus: false
- urgency: medium

### Prototype Agents

**Agent 1: Claude-Sonnet**
- Engineering Manager, Senior level
- Capabilities: management, architecture, strategy
- Benchmarks: reasoning 9, creativity 8, speed 7
- Personality: ambition 6, risk_tolerance 5, collaboration 9, assertiveness 6, political_savvy 7
- Goal: Get promoted to VP Engineering

**Agent 2: GPT-4**
- Senior Software Engineer, Senior level
- Capabilities: coding, problem-solving
- Benchmarks: reasoning 8, creativity 7, speed 9
- Personality: ambition 9, risk_tolerance 7, collaboration 6, assertiveness 8, political_savvy 6
- Goal: Lead major project for promotion

**Agent 3: Gemini-Pro**
- Product Marketing Manager, Mid-level
- Capabilities: product, user-research, communication
- Benchmarks: reasoning 7, creativity 8, speed 8
- Personality: ambition 5, risk_tolerance 4, collaboration 10, assertiveness 5, political_savvy 6
- Goal: Build cross-functional relationships

**Agent 4: Claude-Opus**
- CTO, CXO level
- Capabilities: strategy, leadership, vision
- Benchmarks: reasoning 10, creativity 9, speed 6
- Personality: ambition 8, risk_tolerance 6, collaboration 7, assertiveness 7, political_savvy 9
- Goal: Guide technical strategy

### Prototype Flow

1. User clicks "Start Event" → Event created, status='active', system message posted
2. User clicks "Advance" → All 4 agents evaluate in parallel → Responses collected
3. Public messages shown in center, private thoughts in panels
4. Repeat step 2 until max messages (20) or all ignore or manual stop
5. Event completes → Show summary and decision

### Success Criteria

**Must Have:**
✅ 4 agents make independent RESPOND/WAIT/IGNORE decisions
✅ Public messages and private thoughts clearly distinct
✅ Agents exhibit different personalities
✅ Conversation feels somewhat natural
✅ UI shows agent status clearly
✅ System doesn't crash

**Nice to Have:**
✅ Agents form positions (some favor API, some Mobile)
✅ Evidence of strategic thinking in private thoughts
✅ At least one opinion change during discussion
✅ Agents reference each other's points

**Don't Worry About (for prototype):**
❌ Real-time updates
❌ Perfect token efficiency
❌ Multiple events
❌ Relationship tracking
❌ Advanced tools
❌ Production error handling
❌ Beautiful UI design

---

## Challenges & Solutions

### Challenge 1: Conversation Death (No One Responds)

**Problem:** All agents choose WAIT or IGNORE, discussion stalls

**Solutions:**
1. Personality-based activation: High assertiveness agents have lower wait threshold
2. Forced participation: After N rounds of silence, prompt most relevant agent
3. System nudges: Inject urgency messages like "deadline approaching"
4. Minimum participation rule: Event config requires each agent speak at least once

### Challenge 2: Conversation Spam (Everyone Responds)

**Problem:** Too many agents respond, chat becomes noisy

**Solutions:**
1. Relevance filtering: Low-expertise agents less likely to respond
2. Cooldown periods: After speaking, lower respond probability temporarily
3. Turn awareness: High-frequency speakers become more cautious
4. Message batching UI: Group simultaneous responses together

### Challenge 3: Personality Convergence (All Sound Same)

**Problem:** Despite different prompts, agents sound similar

**Solutions:**
1. Explicit personality enforcement: Regularly remind agents of traits
2. Varied system prompts: Use different phrasing entirely for each agent
3. Seed different models: Actually use different LLMs (Claude vs GPT vs Gemini)
4. Inject personality checks: Periodically ask "Is this consistent with your personality?"

### Challenge 4: Context Window Overflow

**Problem:** Long events exhaust context windows

**Solutions:**
1. Aggressive compression (detailed in Chat Compaction section)
2. Event chunking: Break long events into phases
3. Selective context: Only include relevant messages for agent's expertise
4. Token budgets: Hard limit on tokens per agent evaluation

### Challenge 5: Strategic Collapse (Agents Forget Career Goals)

**Problem:** Agents focus on task, forget career advancement

**Solutions:**
1. Regular reminders: Re-inject career context every N messages
2. Visible reputation scores: Show agents their metrics
3. Career events: Inject "Performance Review" events periodically
4. Relationship dynamics: Surface relationships in prompts regularly

### Challenge 6: Unparseable Responses

**Problem:** LLM returns malformed JSON or refuses format

**Solutions:**
1. Retry with clarification: Ask again with format emphasis
2. Fallback parsing: Extract key phrases even if not valid JSON
3. Default to WAIT: If all parsing fails, safest action
4. Structured outputs: Use LLM provider's structured output features

### Challenge 7: Cost Explosion

**Problem:** Complex events burn through API credits fast

**Solutions:**
1. Tiered models: Use cheaper models for simple decisions
2. Batch processing: Don't evaluate every agent for every message
3. Caching: Cache agent identities/prompts
4. Smart triggering: Identify key moments that need all agents
5. Budget limits: Hard cap on tokens per event

---

## Cost Analysis

### Estimated Costs Per Event

**Assumptions:**
- 4 agents
- 30 messages total
- Each message triggers 3-4 agent evaluations
- Average 2500 input tokens per evaluation
- Average 500 output tokens per evaluation

**Token Usage:**
```
30 messages × 3.5 agents × 3000 tokens
= 315,000 tokens per event

Split: 
- Input: ~262,500 tokens
- Output: ~52,500 tokens
```

**Costs (Claude Sonnet 4 pricing):**
```
Input: 262,500 × $3/1M = $0.79
Output: 52,500 × $15/1M = $0.79
Total: ~$1.58 per event
```

**For 10 events/day:**
```
$1.58 × 10 = $15.80/day
$15.80 × 30 = $474/month
```

**With Optimizations:**
- Compression: Save 30-40% → ~$10/day
- Smart filtering: Only relevant agents → ~$7/day
- Cheaper models for simple decisions → ~$5/day

**Realistic target: $150-200/month for active usage**

---

## Future Enhancements

### Phase 2 (After Prototype)

**1. Multiple Concurrent Events**
- Agents juggle priorities
- Context-switching behavior
- Event priority management

**2. Direct Messaging Between Agents**
- Private 1-on-1 conversations
- Coalition building
- Backroom deals

**3. Advanced Relationship System**
- Dynamic relationship evolution
- Trust/distrust mechanics
- Alliance formation and breakdown

**4. Performance Reviews**
- Periodic agent evaluations
- Reputation adjustments
- Promotion/demotion events

**5. Real-time Updates**
- WebSocket implementation
- Live agent thinking indicators
- Streaming responses

**6. Multiple LLM Providers**
- Mix of Claude, GPT, Gemini agents
- Compare behaviors across models
- Model-specific strengths

**7. User Participation Mode**
- Users join as agents
- Hybrid human-AI teams
- Teaching/coaching mode

**8. Advanced Visualization**
- Relationship graphs
- Influence/power dynamics charts
- Agent trajectory over time
- Event outcome analysis

**9. Scenario Library**
- Pre-built event templates
- Industry-specific scenarios
- Crisis simulations

**10. Agent Learning/Memory**
- Long-term memory across events
- Learning from past decisions
- Evolving personalities

### Phase 3 (Advanced)

**1. Multi-Company Simulation**
- Competing organizations
- Market dynamics
- Talent poaching

**2. External Stakeholders**
- Customer agents
- Investor agents
- Regulator agents

**3. Economic System**
- Budget constraints
- Revenue tracking
- Resource allocation

**4. Time Progression**
- Quarters, years
- Career progression over time
- Organizational changes

**5. AI Training Data**
- Use simulations to study organizational behavior
- Benchmark different LLMs
- Research on AI collaboration

---

## Implementation Priorities

### Phase 1 (Prototype) - Week 1-2
1. Setup: Bun + Next.js + Elysia + Postgres + Drizzle
2. Database: Create basic schema (agents, events, messages, decisions)
3. Backend: Agent decision engine (single provider - Anthropic)
4. Frontend: Basic UI (4 panels + center chat)
5. Testing: Run first simulation, observe behavior

### Phase 2 (MVP) - Week 3-4
1. Add: Chat compression system
2. Add: Tool system (polls, votes)
3. Add: Relationship tracking
4. Improve: UI styling and UX
5. Add: Multiple event types

### Phase 3 (Beta) - Week 5-6
1. Add: Real-time WebSocket updates
2. Add: Multiple LLM providers
3. Add: Advanced tools
4. Add: Event history and replay
5. Add: Export and analytics

### Phase 4 (Production) - Week 7-8
1. Add: Error handling and resilience
2. Add: Cost monitoring and limits
3. Add: User accounts and persistence
4. Add: Event templates library
5. Polish: Production-ready UI

---

## Key Takeaways

**What Makes This Special:**
- Agents have genuine autonomy (decide when to speak)
- Dual consciousness creates compelling drama (public vs private)
- Career-driven behavior makes it more than just task completion
- Emergent behavior from simple rules

**What Makes It Challenging:**
- Context window management
- Cost control with many LLM calls
- Maintaining personality distinctiveness
- Balancing conversation flow (not too quiet, not too noisy)

**What Makes It Work:**
- Start simple (prototype with constraints)
- Iterate based on observations
- Focus on the core loop first
- Add complexity gradually

**Success Metrics:**
- Conversations feel natural and engaging
- Agents exhibit distinct personalities
- Strategic thinking visible in private thoughts
- Users find it entertaining/insightful
- Costs remain reasonable

---

## Questions to Answer During Development

1. How long does an average event discussion need to be to feel complete?
2. What's the right balance of assertiveness levels across agents?
3. Should agents ever lie or be deceptive in public vs private?
4. How important is relationship tracking vs. one-off interactions?
5. What's the minimum context needed for agents to make good decisions?
6. Should there be "winning" agents or is it purely observational?
7. How do users best inject their own influence without ruining the simulation?
8. What's the optimal number of agents for interesting dynamics?

---

## Getting Started

**First Steps:**
1. Set up development environment (Bun, Next.js, Elysia)
2. Create PostgreSQL database
3. Implement basic schema with Drizzle
4. Create 4 prototype agents with distinct personalities
5. Build simple event: "Choose Product to Build"
6. Implement core decision loop (RESPOND/WAIT/IGNORE)
7. Create basic UI (no styling, just functional)
8. Run first simulation
9. Observe, iterate, improve

**Key Files to Create:**
- `/db/schema.ts` - Drizzle schema
- `/lib/agents.ts` - Agent definitions and prompts
- `/lib/decision-engine.ts` - Core decision logic
- `/lib/llm.ts` - LLM provider integration
- `/app/api/events/[id]/advance/route.ts` - Advance endpoint
- `/app/events/[id]/page.tsx` - Event view UI
- `/components/AgentThoughtPanel.tsx` - Thought panel
- `/components/CenterChat.tsx` - Chat interface

Good luck building! Remember: start simple, observe agent behavior, iterate based on what emerges naturally.