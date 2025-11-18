'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { Home, Library, Settings, Bot, TrendingUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const menuItems = [
  { href: '/', label: 'Meu Status Atual', icon: Home },
  { href: '/trends', label: 'Tendências e Histórico', icon: TrendingUp },
  { href: '/library', label: 'Guia', icon: Library },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const handleChatClick = () => {
    window.dispatchEvent(new CustomEvent('toggle-chat-drawer'));
  };

  return (
    <Sidebar
      className="bg-sidebar-background text-sidebar-foreground"
      collapsible="icon"
    >
      <SidebarRail />
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2.5">
          <Popover>
            <PopoverTrigger asChild>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 cursor-pointer">
                  <Logo className="size-6 text-primary" />
                </div>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="max-w-xs">
                <div className="space-y-2 text-sm">
                    <h4 className="font-bold text-base">O Conceito da Aura</h4>
                    <p className="text-muted-foreground">
                        Escolhemos o nome “Aura” porque ele representa uma presença inteligente e protetora que acompanha o usuário de forma sutil. A logo reflete essa ideia: o olho minimalista simboliza percepção e monitoramento contínuo, enquanto o círculo ao redor transmite proteção e equilíbrio, representando a aura que envolve e cuida. Juntos, nome e símbolo reforçam a missão da Aura: oferecer segurança, bem-estar e harmonia entre humano e tecnologia.
                    </p>
                </div>
            </PopoverContent>
          </Popover>
          <h1 className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden text-center">
            Harmony IA
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                href={item.href}
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
                className="justify-center"
              >
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden text-center">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleChatClick}
              tooltip={{ children: 'Conversar com a Aura' }}
              className="justify-center"
            >
              <Bot />
              <span className="group-data-[collapsible=icon]:hidden text-center">Conversar com a Aura</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
