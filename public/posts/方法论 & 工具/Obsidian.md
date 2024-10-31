
## Obsidian
### 插件
- Obsidian_to_Anki


### 一些问题
#### mermaid插图超出视口
设置-外观-添加自定义css `mermaid.css`
```css
/* .../mermaid.css */
.mermaid svg {
    width: 100%;
    height: auto;
}
```