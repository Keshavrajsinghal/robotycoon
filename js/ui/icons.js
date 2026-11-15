// Inline SVG icons (stroke-based, 24x24 grid). Drawing code, not content.

const P = {
	menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
	follow: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="8"/>',
	labels: '<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
	route: '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><path d="M10 6h10M10 12h10M10 18h10"/><circle cx="5" cy="12" r="2"/>',
	town: '<path d="M3 21V10l5-3 5 3v11M13 21V6l4-3 4 3v15M3 21h18M6 13h2M6 17h2M16 9h2M16 13h2M16 17h2"/>',
	book: '<path d="M4 4h6a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h7z"/>',
	more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
	motion: '<path d="M4 12h3l2-5 4 10 2-5h5"/>',
	restart: '<path d="M4 4v6h6"/><path d="M5.5 15a7 7 0 1 0 1.6-7.4L4 10"/>',
	back: '<path d="M18 5v14L8 12z"/><path d="M6 5v14"/>',
	forward: '<path d="M6 5v14l10-7z"/><path d="M18 5v14"/>',
	play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
	pause: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/>',
	close: '<path d="M6 6l12 12M18 6L6 18"/>',
	up: '<path d="M6 15l6-6 6 6"/>',
	down: '<path d="M6 9l6 6 6-6"/>',
	park: '<path d="M3 20h18M5 20V11l7-6 7 6v9M10 20v-5h4v5"/>',
	text: '<path d="M4 6h16M4 12h10M4 18h13"/>',
	tool: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L3 18l3 3 6.2-6.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>',
	showroom: '<path d="M4 20V9M10 20V5M16 20v-8M20 20H2"/>',
};

export function icon(name, label) {
	const aria = label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true"';
	return `<svg class="icon" viewBox="0 0 24 24"${aria}>${P[name] ?? ""}</svg>`;
}
