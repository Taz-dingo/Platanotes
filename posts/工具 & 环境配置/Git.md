
### 去除已经提交的文件

要将已经上传的文件从 Git 版本控制中移除并添加到 `.gitignore` 中

1. **在 `.gitignore` 文件中添加你不希望被跟踪的文件或目录**：
    
    打开你的项目根目录下的 `.gitignore` 文件，并添加你希望忽略的文件或目录。

2. **从 Git 的索引中移除这些文件**：
    
    使用 `git rm` 命令将这些文件从 Git 的索引中移除，但不删除它们在文件系统中的实际文件。例如：
    
```bash
git rm --cached <file_or_directory>    

// 例如，如果你想从索引中移除 `uploads/` 目录，你可以运行：
git rm -r --cached uploads/
```

这样，你就完成了将文件添加到 `.gitignore` 文件中，并将其从 Git 的版本控制中移除的操作。


### git版本号

to be continue...

