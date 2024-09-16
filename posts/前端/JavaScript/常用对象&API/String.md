## String
### 基本操作

- **`charAt(index)`**: 返回指定索引位置的字符。
- **`charCodeAt(index)`**: 返回指定索引位置的字符的 Unicode 编码。
- **`split(separator, limit)`**: 将字符串拆分成数组，分隔符为 `separator`，可以限制拆分的次数。

### 增删

- **`concat(...strings)`**: 将一个或多个字符串连接在一起。
- **`slice(beginIndex, endIndex)`**: 返回从 `beginIndex` 到 `endIndex` 之间的子字符串。**特点是endIndex可以为负值，表示从结尾开始计算。**
- **`substring(indexStart, indexEnd)`**：和slice一样，只是不支持负值（会被当作0）。
- **`trim()`**: 去除字符串两端的空白字符。

### 查找与匹配

- **`includes(searchString, position)`**: 判断字符串是否包含指定的子字符串。
- **`indexOf(searchString, fromIndex)`**: 返回指定子字符串第一次出现的位置，如果没有找到则返回 -1。
- **`lastIndexOf(searchString, fromIndex)`**: 返回指定子字符串最后一次出现的位置，如果没有找到则返回 -1。
- **`match(regexp)`**: 使用正则表达式匹配字符串，返回匹配的结果数组。

### 替换与转换

- **`replace(searchValue, newValue)`**: 替换字符串中的指定子字符串或匹配项。
- **`toLowerCase()`**: 返回一个将所有字符转换为小写的新字符串。
- **`toUpperCase()`**: 返回一个将所有字符转换为大写的新字符串。

### 字符串检查

- **`startsWith(searchString, position)`**: 判断字符串是否以指定的子字符串开头。
- **`endsWith(searchString, length)`**: 判断字符串是否以指定的子字符串结尾。

