import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircuitBoardIcon,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  LayoutDashboardIcon,
  Loader2,
  LogIn,
  LucideIcon,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  User2Icon,
  UserX2Icon,
  X,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  ShoppingCart,
  Users2,
  Ticket,
  UsersRound,
  Lock,
} from 'lucide-react';



import {
  IconApps,
  IconBarrierBlock,
  IconBoxSeam,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconServerOff,
  IconSettings,
  IconTruck,
  IconUserShield,
  IconUsers,
  IconLock, 
  IconBrowserCheck,
  IconBriefcase, 
} from '@tabler/icons-react'


export type Icon = LucideIcon;

export const Icons = {
  dashboard: LayoutDashboardIcon,
  logo: Command,
  login: LogIn,
  logout: X,
  close: X,
  profile: User2Icon,
  spinner: Loader2,
  kanban: CircuitBoardIcon,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  employee: UserX2Icon,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  home: Home,
  lineChart: LineChart,
  listFilter: ListFilter,
  moreHorizontal: MoreHorizontal,
  package: Package,
  package2: Package2,
  panelLeft: PanelLeft,
  plusCircle: PlusCircle,
  search: Search,
  shoppingCart: ShoppingCart,
  users2: Users2,
  lock: Lock,
  ticket: Ticket,
  usersRound: UsersRound,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_191_13499)">
      <path
        d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
        fill="#4285F4"
      />
      <path
        d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
        fill="#34A853"
      />
      <path
        d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
        fill="#FBBC05"
      />
      <path
        d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
        fill="#EB4335"
      />
    </g>
    <defs>
      <clipPath id="clip0_191_13499">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
  ),
  apple: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2c-.8 0-1.6.3-2.2.8-.8.7-1.5 1.9-1.2 3 .2 1.2 1.1 1.8 2 1.8.7 0 1.5-.3 2.2-1 .6-.6 1.1-1.7.9-2.8-.1-1-.8-1.8-1.7-2.1zM9.7 8.3c-.6.1-1.1.3-1.6.6C7 9.2 6 10.6 6 12c0 1.3.5 2.7 1.2 3.8.8 1.2 1.8 2.3 3 2.3 1.1 0 1.3-.6 2.8-.6s1.7.6 2.8.6c1.2 0 2.1-1.1 2.8-2.3.7-1.2 1.2-2.5 1.2-3.8 0-1.7-.9-3.2-2.3-4.1-.9-.5-2-.7-2.5-.7-.7 0-1.4.4-2 .4-.5 0-1.1-.4-1.9-.4-.1 0-.3 0-.5.1z" />
    </svg>
  ),
  paypal: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="currentColor"
      {...props}
    >
      <path d="M47.6 9.1c-2.7-1.5-6.7-1.6-11.6-1.6h-9.2c-1.2 0-2.4.5-3.3 1.2C21.4 10.2 20 14 20 18.3c0 .6.1 1.3.2 1.9l5.6 30.5c.2.9.9 1.6 1.8 1.6h8.8c2.1 0 4-1.3 4.4-3.4l.2-1.2h8.3c4.8 0 8.4-.5 10.8-1.7 3.8-1.9 5.6-4.9 5.6-9.3 0-2.5-1-4.8-3.2-6.6-.3-.2-.7-.4-1-.5 1.3-1.2 2.3-2.6 2.7-4.2.3-1 .5-2 .5-3.1 0-2.9-1.2-5.3-3.5-7.1-2.7-2.2-6.5-2.7-11.4-2.7zM24.2 12c0-1.5.6-2.9 1.5-3.7.9-.8 2.1-1.2 3.3-1.2h9.2c4.1 0 7.3.2 9.3.7 2.4.5 3.5 1.5 4.4 3.1.8 1.3 1.3 3.1 1.3 5 0 1.1-.1 2-.3 2.9-.3 1.3-1.2 2.4-2.5 3-1.4.6-3.2.8-5.7.8h-8.3l-1.6 8.4h6.8c1.8 0 3.6-.2 5.2-.6 1.9-.5 3.3-1.4 4.3-2.5 1-1.2 1.4-2.7 1.4-4.2 0-1.6-.7-3-1.9-4-.6-.5-1.4-.7-2.3-.7-2.4 0-4.6 1.4-5.5 3.7-.4 1-.2 2.1.6 2.9.8.8 1.9 1.2 3 1.2h.7c1.3 0 2.4.7 3.1 1.6.6.9 1 2.1 1 3.3 0 1.3-.4 2.6-1 3.7-.5.9-1.2 1.6-2.1 2.2-2.5 1.5-5.5 2.3-9.5 2.3H24.8l-.6-3.2zM30 40.1c.4-1.5.9-3.1 1.6-4.6.8-1.9 1.7-3.4 2.7-4.4 1-.9 2.4-1.4 3.8-1.4h8.4c1.1 0 2.1.4 2.8 1.2.5.5.7 1.2.7 1.8 0 1.3-.7 2.4-2 3.3-1.1.8-2.6 1.2-4.1 1.2h-9.5l-1.6 8.4c0 .1-.1.2-.2.2-.1 0-.1 0-.2-.1h-.1z" />
    </svg>
  ),
    // You can add SVGs for Mpesa, cUSD, USDT, and USDC here
    mpesa: ({ ...props }: LucideProps) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg"  
    viewBox="0 0 48 48">
      <path fill="#aed580" d="M31.003,7.001l-0.001-5.5c0-0.828,0.672-1.5,1.5-1.5	c0.828,0,1.5,0.672,1.5,1.5v5.5H31.003z"/>
      <path fill="#aed580" d="M14.964,47.999h18.073c0.533,0,0.965-0.432,0.965-0.965V4.964c0-0.533-0.432-0.965-0.965-0.965	H14.964c-0.533,0-0.965,0.432-0.965,0.965v42.07C13.999,47.567,14.431,47.999,14.964,47.999z"/>
      <path fill="#fff" fillRule="evenodd" d="M17.739,29.001h12.524c0.962,0,1.741-0.78,1.741-1.741V10.743	c0-0.962-0.78-1.741-1.741-1.741H17.739c-0.962,0-1.741,0.78-1.741,1.741V27.26C15.997,28.222,16.777,29.001,17.739,29.001z" clipRule="evenodd"/>
      <path fill="#9b2310" fillRule="evenodd" d="M12.001,22.001	c3.643-0.7,5.865-2.448,7-5c1.135,2.552,3.357,4.3,7,5H12.001z" clipRule="evenodd"/>
      <path fill="#e60023" fillRule="evenodd" d="M12.001,22.001	c4.273,0.867,6.476,1,11,1c5.076,0,11.712-1.939,14-6l-9-4C24.039,18.139,21.863,22.001,12.001,22.001z" clipRule="evenodd"/>
      </svg>
    ),
    cUSD: ({ ...props }: LucideProps) => (
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      {/* Insert cUSD SVG path here */}
    </svg>
    ),

    
    usdt: ({ ...props }: LucideProps) => (
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path fill="#fff" d="M38,22c0-1.436-4.711-2.635-11-2.929V16h8v-6H13v6h8v3.071C14.711,19.365,10,20.564,10,22	s4.711,2.635,11,2.929V36h6V24.929C33.289,24.635,38,23.436,38,22z M24,24c-6.627,0-12-1.007-12-2.25c0-1.048,3.827-1.926,9-2.176	v3.346c0.96,0.06,1.96,0.08,3,0.08s2.04-0.02,3-0.08v-3.346c5.173,0.25,9,1.128,9,2.176C36,22.993,30.627,24,24,24z"></path>
    </svg>
    ),
    usdc: ({ ...props }: LucideProps) => (
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      {/* Insert USDC SVG path here */}
    </svg>
    ),

  twitter: Twitter,
  check: Check,
};

export const TablerIcons = {
  apps: IconApps,
  barrierBlock: IconBarrierBlock,
  boxSeam: IconBoxSeam,
  chartHistogram: IconChartHistogram,
  checklist: IconChecklist,
  components: IconComponents,
  error404: IconError404,
  exclamationCircle: IconExclamationCircle,
  hexagonNumber1: IconHexagonNumber1,
  hexagonNumber2: IconHexagonNumber2,
  hexagonNumber3: IconHexagonNumber3,
  hexagonNumber4: IconHexagonNumber4,
  hexagonNumber5: IconHexagonNumber5,
  layoutDashboard: IconLayoutDashboard,
  messages: IconMessages,
  routeAltLeft: IconRouteAltLeft,
  serverOff: IconServerOff,
  settings: IconSettings,
  truck: IconTruck,
  userShield: IconUserShield,
  users: IconUsers,
  lock: IconLock,
  calendar: IconBrowserCheck,
  invites: IconBriefcase
};

// Export both Icons objects (Lucide and Tabler) if needed
export type TablerIconsType = typeof TablerIcons;