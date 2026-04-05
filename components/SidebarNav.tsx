"use client";

import { toast } from 'sonner';

/**
* Sidebar Navigation Component
* Handles the interactive menu and construction notifications.
*/
export default function SidebarNav() {
const items = ['Dashboard', 'Sensors', 'Analytics', 'Nodes', 'Settings'];

return (
<nav className="flex-1 space-y-1">
{items.map((item) => (
<button
key={item}
onClick={() => {
if (item !== 'Dashboard') {
toast.info(`${item} module is under construction`, {
description: "Engineering is currently scaling resources for this feature.",
});
}
}}
className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
item === 'Dashboard'
? 'bg-white/5 text-white border border-white/10 shadow-xl'
: 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
}`}
>
{item}
</button>
))}
</nav>
);
}
