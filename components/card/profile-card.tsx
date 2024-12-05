import React from "react";

import ProfileItem from "@/components/card/profile-item";
import GlassCard from "@/components/common/glass-card";

export default function ProfileCard() {
  return (
    <GlassCard className="py-4">
      <ProfileItem
        name={"Tazdingo"}
        avatar="/avatar.png"
        role="我是一只鱼"
        bio=""
        socialLinks={{
          email: "tazdingo@foxmail.com",
          github: "https://github.com/Taz-dingo",
        }}
      />
    </GlassCard>
  );
}
