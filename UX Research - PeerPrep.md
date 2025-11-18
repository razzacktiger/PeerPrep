# **PeerPrep: UX Research & Platform-Specific Design**

This document provides foundational UX research artifacts for the PeerPrep app.

## **Part 1: UX Research Artifacts**

These artifacts help us empathize with the user and map out their experience, ensuring we build the right product.

### **1\. Persona: "Alex the CS Student"**

A persona is a fictional character representing your target user. All design decisions should be made with Alex in mind.

* **Name:** Alex Johnson  
* **Age:** 21  
* **Occupation:** 3rd Year Computer Science Student  
* **Bio:** Alex is preparing for upcoming technical interviews for summer internships. They do well in their classes but get nervous during interviews. They feel "rusty" on data structures and algorithms and find it hard to get into realistic practice. Their friends are busy, and they feel awkward asking them to "grill" them on technical questions.  
* **Goals:**  
  * Get consistent, low-pressure practice for technical interviews.  
  * Identify and fix weak spots in their knowledge (e.g., "Trees," "Dynamic Programming").  
  * Build confidence in explaining their thought process out loud.  
  * Track their progress to see if they are improving over time.  
* **Frustrations:**  
  * "I have no one to practice with on my schedule."  
  * "Reading 'Cracking the Coding Interview' isn't enough; I need to *talk*."  
  * "Mock interviews with senior engineers are high-stakes and expensive."  
  * "I'm afraid of getting unfair or mean feedback from random people online."

### **2\. User Journey Map**

This map follows Alex's "happy path" through the app, from finding a partner to completing a session. It identifies the *conceptual screens* (touchpoints) that need to be designed.

| Phase | User Action (Task) | Thoughts & Feelings (Emotions) | Conceptual Touchpoints (Screens to be Designed) | Opportunities |
| :---- | :---- | :---- | :---- | :---- |
| **Discovery** | Alex feels nervous about an upcoming interview. I want to practice. | *Anxious, Motivated* | App Store, Friends | Highlight "low-pressure" and "instant" practice in marketing. |
| **Onboarding** | Alex logs into the app for the first time. | *Curious, Hopeful* | **Sign In / Sign Up Screen** | Make sign-up and login as frictionless as possible. |
| **Initiation** | Lands on the Home screen. Sees their streak (or starts one). Taps "Practice Now." | *Focused, Determined* | **Home Screen** | The "Practice Now" CTA must be the primary, most obvious action. |
| **Selection** | Browses topics and selects "Data Structures." Selects "Medium" difficulty. | *Decisive* | **Topic Selection Screen** | Needs a clear list/grid of topics and a simple way to filter or select difficulty. |
| **Waiting** | Taps "Practice Now" and waits to be matched with a peer. | *Anticipation, Slightly Anxious* | **Matchmaking / Queue Screen** | Must show a clear "Finding your peer..." message. Reassure them it's working. |
| **Practice** | Enter the session. See the timer, the question, and the peer's name. | *Engaged, Focused, Stressed* | **Session Room Screen** | Needs a clean, distraction-free UI. Timer must be prominent. |
| **Feedback** | Session ends. Rates their peers on the rubric. | *Reflective, Relieved* | **Peer Feedback Screen** | Needs simple, clear controls (e.g., sliders, star ratings) for the rubric. |
| **Review** | Sees the AI Cross-Check. Read the summary. | *Curious, Vindicated, Educated* | **Session Summary / AI Screen** | The AI summary is a key "magic moment." It must be easy to read and digest. |
| **Completion** | Submits feedback and goes to the Dashboard to see their new stats. | *Accomplished, Satisfied* | **Dashboard Screen** | Seeing stats updates (streak, total sessions) is the reward loop. |

### **3\. Storyboard**

This storyboard visualizes Alex's journey from problem to solution.

* **Panel 1:** Alex is at their desk, looking stressed, with a "Technical Interviews: 1 Week" reminder on their monitor. **Thought bubble:** "I need to practice, but I have no one\!"  
* **Panel 2:** Alex is on their phone, discovering the PeerPrep app. **App Screen:** "Practice interviews with peers."  
* **Panel 3:** Alex is on their couch, looking at a simple **Home Screen** and taps the main "Practice Now" button.  
* **Panel 4:** Alex is actively talking, explaining a technical concept in the **Session Room** on their phone.  
* **Panel 5:** Alex is reviewing the **AI Feedback summary** on their phone, which shows an "8.5/10 Fairness Score" and "Strengths: Clear communication."  
* **Panel 6:** Alex is smiling, looking confident. They are looking at **their Dashboard** which shows their practice streak. **Thought bubble:** "I'm ready for this."