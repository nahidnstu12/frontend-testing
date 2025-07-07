"use client"

import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import React from "react"
import { Link, useLocation } from "react-router"

type MenuItem = {
  title: string;
  to: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

const frontendMenuItems: MenuItem[] = [
  {
    title: "Home",
    to: "/",
  },
  {
    title: "How it works",
    to: "/how-it-works",
  },
  {
    title: "Jobs",
    to: "/jobs",
  },
  {
    title: "Courses",
    to: "/courses",
  },
  {
    title: "Assessments",
    to: "/assessments",
  },
  {
    title: "Demos",
    to: "/demos",
    children: [
      {
        title: "Demo 1",
        to: "/demos/demo-1",
      },
      {
        title: "Demo 2",
        to: "/demos/demo-2",
      },
    ]
  },
]

interface MenuItemProps {
  item: MenuItem;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  
  const isActive = location.pathname === item.to || 
                  (item.children?.some(child => location.pathname === child.to));

  const linkClasses = `
    flex items-center gap-2 px-4 py-2 w-full font-semibold
    ${isActive ? 'text-red-600' : 'text-primary'}
    hover:text-red-400 transition-colors duration-200
  `;

  if (item.children) {
    return (
      <div 
        className="relative group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Button
          className={`${linkClasses} text-left outline-none border-none`}
          variant="ghost"
        >
          {item.icon}
          <span>{item.title}</span>
          <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {isOpen && (
          <div className="absolute left-full top-0 bg-white border rounded-md shadow-lg min-w-[200px] z-50">
            {item.children.map((child, index) => (
              <MenuItem key={index} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.to}
      className={linkClasses}
    >
      {item.icon}
      <span>{item.title}</span>
    </Link>
  );
};

export default function NavMenu() {
  const location = useLocation();

  return (
    <nav className="bg-white">
      <div className="flex items-center gap-1">
        {frontendMenuItems.map((item, index) => (
          <div key={index} className="relative group">
            {item.children ? (
              <div
                className="relative"
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
              >
                <Button 
                  className={`
                    flex items-center gap-2 px-4 py-2 outline-none border-none font-semibold
                    ${location.pathname.startsWith(item.to) ? 'text-red-600' : 'text-primary'}
                    hover:text-red-400 transition-colors duration-200
                  `}
                  variant="ghost"
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
                <div className="absolute left-0 top-full bg-white border rounded-md shadow-lg min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {item.children.map((child, idx) => (
                    <MenuItem key={idx} item={child} />
                  ))}
                </div>
              </div>
            ) : (
              <Link
                to={item.to}
                className={`
                  flex items-center gap-2 px-4 py-2 font-semibold
                  ${location.pathname === item.to ? 'text-red-600' : 'text-primary'}
                  hover:text-red-400 transition-colors duration-200
                `}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}


