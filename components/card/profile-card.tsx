import React from 'react'
import Image from 'next/image'
import { Twitter, Github, Linkedin } from 'lucide-react'

interface ProfileCardProps {
  name: string
  role?: string
  avatar?: string
  bio?: string
  socialLinks?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

export default function ProfileCard({
  name,
  role,
  avatar = '/default-avatar.png',
  bio,
  socialLinks
}: ProfileCardProps) {
  return (
    <div className="dark:bg-gray-800 p-6 max-w-sm mx-auto">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={avatar}
            alt={`${name}'s avatar`}
            fill
            className="rounded-full object-cover"
          />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{name}</h2>
        {role && (
          <p className="text-gray-600 dark:text-gray-300 mt-1">{role}</p>
        )}
        
        {bio && (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-3 text-sm">
            {bio}
          </p>
        )}

        {socialLinks && (
          <div className="flex space-x-4 mt-4">
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
