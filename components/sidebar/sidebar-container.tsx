import MenuCard from "../card/menu-card";

export default function SidebarContainer() {
  return (
    <aside className="sticky top-2">
      <MenuCard />
      <div id="menu-card-append" />
    </aside>
  );
}
