# Design

Layout and color for the prototype. Copy the `idea-b-workspace9` frames on the Lo-fi page of [HCI Group B](https://www.figma.com/design/0rPJ2At16HVd3B5wUfCgDa/HCI-Group-B?node-id=33-5). Those frames are 1512 by 982. Leave the earlier 1920 wireframes and the storyboard on the right of that page out of the layout.

## Color

| Role | Hex | Use |
| --- | --- | --- |
| Page | `#ffffff` | Page background and column surfaces |
| Ink | `#222222` | Body text, primary buttons, selected chips |
| Muted | `#6b6b6b` | Secondary labels and the footer line |
| Line | `#bdbdbd` | Borders on columns, fields, and buttons |
| Hairline | `#e0e0e0` | Dividers inside a column |
| Soft | `#f0f0f0` | Active file tab and assistant bubbles |
| Wash | `#fafafa` | Slide card and the file drop zone |
| User bubble | `#d9d9d9` | The student's own chat messages |
| On ink | `#ffffff` | Text on a `#222222` button or chip |

Primary actions use `#222222` with white text: Continue, Send, and a selected course chip. Secondary buttons are white with a `#bdbdbd` border and `#222222` text.

A dialog covers the page with `#222222` and centers a white panel. The add-context panel is 760 by 223 with a 14px corner radius.

## Type

The typeface is Arial.

- 14px regular for body text, the context label, and Profile.
- 13px medium for "+ Add context".
- 11px regular in `#6b6b6b` for the footer line.

## Workspace layout

The frame is 1512 wide and 982 tall. The header is 72 tall and spans the width. The three columns sit under it, each 873 tall, with a 24px page margin and a 16px gap.

| Region | x | y | Width | Height | Radius |
| --- | --- | --- | --- | --- | --- |
| Header | 0 | 0 | 1512 | 72 | 0 |
| Course material | 24 | 72 | 260 | 873 | 12 |
| Document | 300 | 72 | 480 | 873 | 12 |
| Chat | 796 | 72 | 692 | 873 | 12 |

Header controls, measured from the top-left of the frame:

- "Context:" at x 24, muted, 14px.
- Course dropdown at x 86, y 20, 200 by 36, radius 8.
- "+ Add context" at x 296, y 23, 106 by 30, radius 8.
- Profile at x 1414, y 20, 74 by 36, radius 8. That keeps a 24px margin on the right.

Inside the document column, the open-file tab is `#f0f0f0`. The slide card is `#fafafa` with a `#bdbdbd` border and an 8px radius.

Inside the chat column, the chat switcher is a white field, 220 by 34, radius 8, inset 16px from the column edge. Assistant bubbles are `#f0f0f0`, radius 12, and sit on the left. The student's bubbles are `#d9d9d9`, radius 12, and sit on the right. The composer is a white field with a `#bdbdbd` border and a 10px radius. Send is a `#222222` button, radius 8.

The footer line sits under the columns, centered, in muted 11px type: "Lo-fi prototype · AI answers and confidence scores are scripted".

## Other screens

Profile setup is not the three-column shell. It is one column, 560 wide, centered on the white page (x 476, y 244 on the 1512 frame). Course chips are pills with a fully round radius. The selected pill is `#222222` with white text. The others are white with a `#bdbdbd` border. Continue is `#222222`, radius 8.

The graph replaces the document column only. The header, course material, and chat stay in place.
