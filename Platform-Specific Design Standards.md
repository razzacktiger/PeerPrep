## **Platform-Specific Design Guidelines**

This section delineates the principles for designing the application's screens (as defined in the User Journey Map) to ensure a native user experience on both iOS and Android platforms.

### **1\. Apple Human Interface Guidelines (HIG) for iOS**

**Core Principles:** Clarity (legible text, clear icons), Deference (content is primary, UI is secondary), Depth (distinct layers to convey hierarchy).

* **Navigation:** For top-level navigation (Home, Topics, Dashboard, Profile), the standard iOS component is a **Bottom Tab Bar**. It should be translucent and feature simple, clear icons (like SF Symbols) paired with text labels.  
* **Controls & CTAs:**  
  * **Primary Actions:** For key actions like "Practice Now" (on the **Home Screen**) or "Submit Feedback" (on the **Peer Feedback Screen**), use prominent, full-width "Filled" buttons to make the primary action clear.  
  * **Secondary Actions:** For "Cancel" (on the **Queue Screen**) or "Schedule Session," use less prominent "Text" buttons.  
* **Modality:**  
  * When we need to interrupt the user for a focused sub-task, like selecting a difficulty on the **Topic Selection Screen**, the iOS-native approach is a **Modal Sheet**. This sheet slides up over the current content and must be explicitly dismissed.  
* **Typography & Lists:**  
  * Use large, bold titles at the top of main screens (e.g., "Home," "Topics," "Dashboard").  
  * For the **Profile/Settings Screen** and the "Session History" list on the **Dashboard**, the native pattern is an **Inset Grouped List**. This uses a light gray background with white, rounded-corner "groups" for each section of related content (e.g., "Recording Settings," "Privacy & Data").

### 

### 

### 

### **2\. Google Material Design (Android)**

**Core Principles:** Material is a metaphor (based on "digital paper and ink"), Bold & Graphic, Motion provides meaning.

* **Navigation:**  
  * **Bottom Navigation Bar:** This is the standard for top-level navigation (Home, Topics, Dashboard), just like on iOS.  
  * **Top App Bar:** Use a **Top App Bar** to display the title of the current screen (e.g., "Settings," "Data Structures") and any contextual actions (like a Search icon on the **Topic Selection Screen**).  
* **Components (Cards & Elevation):**  
  * Material Design is built on the concept of "elevation" (shadows). Use **Cards** to contain distinct pieces of content. This is perfect for the **Dashboard** (for stats like "Streak," "Total Sessions") and the "Recent Sessions" list on the **Home Screen**.  
* **Primary CTA (Floating Action Button):**  
  * For the single most important action in the app, the "Practice Now" flow, consider using a **Floating Action Button (FAB)**. This is the circular button that "floats" in the bottom-right corner, typically with a "play" or "plus" icon. It's a strong, clear signal to the user to begin the main task.  
* **Modality:**  
  * For the "Select Difficulty" task, the idiomatic Android pattern is a **Modal Bottom Sheet**. The menu of options (Easy, Medium, Hard) would slide up from the bottom of the screen.  
  * For simple alerts (like "Are you sure you want to end session?"), use a standard **Dialog** box.  
* **Buttons:**  
  * For the main "Sign In" or "Submit Feedback" buttons, use **Filled Buttons** (the highest-emphasis type) that use the app's primary color.  
  * For secondary actions (like "Schedule Session"), use **Outlined Buttons** or **Text Buttons** to show they are less important.

