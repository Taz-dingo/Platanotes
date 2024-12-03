import { getFileTree } from "@/lib/posts/get-posts-tree";

import GlassCard from "../common/glass-card";
import MenuList from "./menu-list";

export default async function MenuCard() {
  const fileTree = await getFileTree();
  const topLevelFolders =
    fileTree.children?.filter((node) => node.type === "directory") || [];

  return (
    <GlassCard>
      <MenuList folders={topLevelFolders} />
    </GlassCard>
  );
}
