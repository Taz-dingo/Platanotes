
[1. 两数之和](https://leetcode.cn/problems/two-sum/) 返回下标 - 哈希法 边遍历边存`val -> index`哈希表

```typescript
function twoSum(nums: number[], target: number): number[] {
    const map = new Map();

    for(let i = 0;i < nums.length;i++){
        if(map.has(target - nums[i])){
            return [i,map.get(target - nums[i])];
        }else{
            map.set(nums[i],i);
        }
    }

    return [];
};
```

### [15. 三数之和](https://leetcode.cn/problems/3sum/) 返回值 - 排序去重

```typescript
function threeSum(nums: number[]): number[][] {
    nums.sort((a,b)=>(a-b));
    const res = [];

    for(let i = 0;i < nums.length - 2;i++){
        if(nums[i] > 0) break;
        if(i > 0 && nums[i-1] === nums[i]) continue;

        let left = i+1;
        let right = nums.length - 1;

        while(left < right){
            const sum = nums[i] + nums[left] + nums[right];

            if(sum > 0) right--;
            else if(sum < 0) left++;
            else{
                res.push([nums[i],nums[left++],nums[right--]]);
                while(left < right && nums[left-1] === nums[left]) left++;
                while(left < right && nums[right] === nums[right+1]) right--;
            }
        }
    }

    return res;
};
```


### [18. 四数之和](https://leetcode.cn/problems/4sum/) 需要注意，这题是target，如果是负数的话就不能像之前那样剪枝（干脆不考虑剪枝了）

```typescript
function fourSum(nums: number[], target: number): number[][] {
    nums.sort((a,b)=>(a-b));
    
    const res = [];

    for(let i = 0;i < nums.length - 3;i++){
        // if(nums[i] > target) break;
        if(i > 0 && nums[i-1] === nums[i]) continue;
        for(let j = i+1;j < nums.length - 2;j++){
            // if(nums[j] > target) break;
            if(j > i+1 && nums[j-1] === nums[j]) continue;

            let left = j+1;
            let right = nums.length - 1;
            while(left < right){
                const sum = nums[i]+nums[j]+nums[left]+nums[right];
                if(sum > target) right--;
                if(sum < target) left++;
                if(sum === target){
                    res.push([nums[i],nums[j],nums[left++],nums[right--]]);
                    while(left < right && nums[left-1] === nums[left]) left++;
                    while(left < right && nums[right] === nums[right+1]) right--; 
                }
            }
        }
    }

    return res;
};
```