---
created: 星期六, 八月 31日 2024, 5:32:21 下午, 1725096741000
modified: 星期六, 八月 31日 2024, 5:32:21 下午, 1725096741000
---


### [FED2 数组去重](https://www.nowcoder.com/practice/7a26729a75ca4e5db49ea059b01305c9?tpId=274&tqId=39522&rp=1&ru=/exam/company&qru=/exam/company&sourceUrl=%2Fexam%2Fcompany&difficulty=undefined&judgeStatus=undefined&tags=&title=)
1. filter结合set
2. `Array.from(new Set(array))` - 我擦这也行
3. 双指针

### [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) - 暴力双循环 / 滑动窗口
```typescript
/**
方法：
滑动窗口+set 

循环不变量：
[left,right] 左闭右闭

每轮循环：
s[right]重复，删除s[left]，left++
s[right]不重复，添加s[right]，尝试更新res，right++;

复杂度：
时间O(n) - 一轮循环
空间O(m) - m为最长不重复子串，m <= n
 */
function lengthOfLongestSubstring(s: string): number {
    const set = new Set();
    let left = 0;
    let right = 0;
    let res = 0;
    while(right !== s.length){
        if(!set.has(s[right])){
            set.add(s[right]);
            res = Math.max(res,right - left + 1);
            right++;
        }else{
            set.delete(s[left]);
            left++;
        }
    }

    return res;
};
```


### [2627. 函数防抖](https://leetcode.cn/problems/debounce/)


### [FED18 寄生组合式继承](https://www.nowcoder.com/practice/dd8eb918b5d343cc8be77a69630f59bf?tpId=274&&tqId=39538&sourceUrl=https%3A%2F%2Fwww.nowcoder.com%2Fexam%2Foj)


Object.definedProperty实现`a===1&&a===2&&a===3`为`true`

---
toDo...
- 手写Promise - then、resolve、reject
- 手写apply、call、bind
