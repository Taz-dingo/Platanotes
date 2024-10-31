
[1005. K 次取反后最大化的数组和](https://leetcode.cn/problems/maximize-sum-of-array-after-k-negations/)

```typescript
function largestSumAfterKNegations(nums: number[], k: number): number {
    nums.sort((a,b)=>(Math.abs(b)-Math.abs(a)));

    for(let i = 0;i < nums.length && k > 0;i++){
        if(nums[i] < 0){
            nums[i] = -nums[i];
            k--;
        } 
    }

    while(k !== 0){
        nums[nums.length - 1] = -nums[nums.length - 1];
        k--;
    }

    return nums.reduce((pre,cur)=>(pre+cur),0);
};
```