## Marks Lite Template Engine. 
Marks LTE is a little template engine used with Marks website generator, and compatible with Marks Engine too.

### Get Started
```bash 
npm i -S @marks-js/lte
OR
yarn add @marks-js/lte
```

### Usign it
```typescript
import { liteTE } from "@marks-js/lte";

// Here you can specify data to use inside the template
const context = {
  title: "Hello Kitty",
  items: [
    "Item 01",
    "Item 02",
    "Item 03",
    "Item 04"
  ]
};

// Use {% javascript statement %}
// {%= javascript result of any value or expression %}
// {% LF %} use LF to add a line feed or "\\n"

// The template source
const source = `
<h1>Here is the title : {%= this.title %}</h1>

<ol>{% for(let itm of this.items) { %}
  <li>{%= itm %}</li>{% } %}
</ol>
`;


const output = liteTE(source, context);

console.log(output);
```

The output will be 
```html
<h1>Here is the title : Hello Kitty</h1>

<ol>
  <li>Item 01</li>
  <li>Item 02</li>
  <li>Item 03</li>
  <li>Item 04</li>
</ol>
```