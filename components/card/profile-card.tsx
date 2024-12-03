import React from "react";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

interface ProfileCardProps {
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export default function ProfileCard({
  name,
  role,
  avatar = "/default-avatar.png",
  bio,
  socialLinks,
}: ProfileCardProps) {
  return (
    <div className="mx-auto max-w-sm p-6 dark:bg-gray-800">
      <div className="flex flex-col items-center">
        <div className="relative mb-4 h-24 w-24">
          <Image
            src={avatar}
            alt={`${name}'s avatar`}
            fill
            className="rounded-full object-cover"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {name}
        </h2>
        {role && (
          <p className="mt-1 text-gray-600 dark:text-gray-300">{role}</p>
        )}

        {bio && (
          <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
            {bio}
          </p>
        )}

        {socialLinks && (
          <div className="mt-4 flex space-x-4">
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
