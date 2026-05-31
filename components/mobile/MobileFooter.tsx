"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "./MobileFooter.module.css";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  iconActive: string;
  path: string;
}

export default function MobileFooter() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: "posts",
      label: "Публикации",
      icon: "https://storage.yandexcloud.net/backet-online-storage/test/posts.png",
      iconActive: "https://storage.yandexcloud.net/backet-online-storage/test/posts-active.png",
      path: "/posts"
    },
    {
      id: "admins",
      label: "Администраторы",
      icon: "https://storage.yandexcloud.net/backet-online-storage/test/admins.png",
      iconActive: "https://storage.yandexcloud.net/backet-online-storage/test/admins-active.png",
      path: "/admins"
    },
    {
      id: "users",
      label: "Пользователи",
      icon: "https://storage.yandexcloud.net/backet-online-storage/test/users.png",
      iconActive: "https://storage.yandexcloud.net/backet-online-storage/test/users-active.png",
      path: "/users"
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`${styles.menuButton} ${
              isActive(item.path) ? styles.active : ""
            }`}
          >
            <span className={styles.iconWrapper}>
              <Image 
                src={isActive(item.path) ? item.iconActive : item.icon}
                alt={item.label}
                width={24}
                height={24}
                className={styles.icon}
              />
            </span>
            <span className={styles.buttonText}>{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
}