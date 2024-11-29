import { getFileTree } from "@/lib/get-posts-tree";
import MenuList from "./menu-list";

export default async function MenuCard() {
  const fileTree = await getFileTree();
  const topLevelFolders = fileTree.children?.filter(node => node.type === 'directory') || [];

  return (
    <div className="sticky top-2">
      <div className=" bg-[rgba(255,255,255,0.5)] p-5 rounded-lg   shadow-md w-full">
        <MenuList folders={topLevelFolders} />
      </div>
      <div id="menu-card-append" />
    </div>
  );
}