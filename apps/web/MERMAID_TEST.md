# Mermaid Diagram Test

Below is a simple Mermaid flowchart. In the Rich Text editor, you should:

1. Create a code block
2. Select "Mermaid" as the language
3. Paste the Mermaid code

## Example Flowchart

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Check Console]
    E --> B
    C --> F[End]
```

## Example Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Editor
    participant MermaidRenderer
    
    User->>Editor: Create code block
    Editor->>Editor: Set language to Mermaid
    User->>Editor: Type Mermaid code
    Editor->>MermaidRenderer: Render diagram
    MermaidRenderer->>User: Display diagram
```

## Example Gantt Chart

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Research           :done,    des1, 2024-01-01,2024-01-07
    Design             :active,  des2, 2024-01-08, 3d
    section Development
    Frontend           :         des3, after des2, 5d
    Backend            :         des4, after des3, 5d
    section Testing
    Unit Tests         :         des5, after des4, 2d
    Integration Tests  :         des6, after des5, 3d
```

## How to use in the editor:

1. Switch to Rich Text mode
2. Add a code block (using the toolbar or by typing ```)
3. Click on the language selector (default is "Plain Text")
4. Choose "Mermaid" from the dropdown
5. Paste any of the Mermaid code examples above
6. You should see both the code and a rendered diagram preview below it