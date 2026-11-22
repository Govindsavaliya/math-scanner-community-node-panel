import {
  ArrowLeft, BadgeCheck, Calculator, ChevronDown, ChevronRight, ChevronUp, Code2, Cog, Eye, EyeOff,
  FolderOpen, Globe, HardDrive, Home, Image, KeyRound, Lock, LayoutDashboard, Mail, Menu, MessageCircle,
  MessageSquare, MessageSquareOff, Moon, Network, Search, Sun, Trash2, User, UserSquare, Users, HelpCircle,
  ArrowRight, Copy, Check, ExternalLink, RefreshCw, Command, LogOut, PanelLeftClose, PanelLeftOpen, X,
  Pencil, LifeBuoy, BookOpen, Settings, Inbox, Plus, Download, GripVertical, Sigma,
  CalendarDays, Star, ArrowUp, ChevronLeft, RotateCcw, History, ShieldAlert, TriangleAlert, ShieldCheck, Info,
} from "lucide-react";

const ICONS = {
  back: ArrowLeft, badge: BadgeCheck, calculator: Calculator, "chevron-down": ChevronDown,
  "chevron-right": ChevronRight, "chevron-up": ChevronUp, code: Code2, cog: Cog, eye: Eye, "eye-off": EyeOff,
  folder: FolderOpen, globe: Globe, drive: HardDrive, home: Home, image: Image, key: KeyRound, lock: Lock,
  dashboard: LayoutDashboard, mail: Mail, menu: Menu, chat: MessageCircle, message: MessageSquare,
  "message-off": MessageSquareOff, moon: Moon, network: Network, search: Search, sun: Sun, trash: Trash2,
  user: User, "user-card": UserSquare, users: Users, help: HelpCircle, forward: ArrowRight, copy: Copy,
  check: Check, external: ExternalLink, refresh: RefreshCw, command: Command, logout: LogOut,
  "panel-close": PanelLeftClose, "panel-open": PanelLeftOpen, x: X, edit: Pencil, support: LifeBuoy,
  docs: BookOpen, settings: Settings, inbox: Inbox, plus: Plus, download: Download, grip: GripVertical,
  math: Sigma, calendar: CalendarDays, "chevron-left": ChevronLeft, restore: RotateCcw, history: History,
  shield: ShieldAlert, warning: TriangleAlert, "shield-check": ShieldCheck, info: Info, star: Star, up: ArrowUp,
};

/** Single icon set (Lucide). `name` is one of the keys above; size defaults to 1em of the surrounding text. */
export default function Icon({ name, size = "1em", strokeWidth = 2, className, ...props }) {
  const Component = ICONS[name] ?? HelpCircle;
  return <Component size={size} strokeWidth={strokeWidth} aria-hidden="true" className={className} {...props} />;
}
