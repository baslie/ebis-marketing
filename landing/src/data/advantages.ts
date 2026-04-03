import handbud from "../assets/partners/handbud.png";
import roofer from "../assets/partners/roofer.svg";
import grandline from "../assets/partners/grand-line.svg";
import eurovent from "../assets/partners/eurovent.png";

export const partners = [
  { name: "Ханбуд", logo: handbud },
  { name: "Руфер", logo: roofer },
  { name: "Грандлайн", logo: grandline },
  { name: "Евровент", logo: eurovent },
] as const;

export const iconPaths: Record<string, string> = {
  package: `<path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" />`,
  shield: `<path d="M12 3 5 6v6c0 5 3.4 8 7 9 3.6-1 7-4 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" />`,
  cut: `<circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.5 15.5" /><path d="m14 14 6 6" />`,
  warehouse: `<path d="m3 10 9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" />`,
  expert: `<circle cx="12" cy="8" r="3.5" /><path d="m9.8 11.2-1.2 8.3L12 17l3.4 2.5-1.2-8.3" /><path d="m12 6.8.7 1.4 1.6.2-1.2 1.1.3 1.6L12 10.3l-1.4.8.3-1.6-1.2-1.1 1.6-.2L12 6.8Z" />`,
};

export const advantages = [
  {
    title: "Всё в\u00A0одном заказе",
    desc: "Черепица, водосток, мембрана и\u00A0крепёж в\u00A0одном договоре и\u00A0с\u00A0одной ответственностью.",
    icon: "package",
    featured: true,
  },
  {
    title: "Фиксация цены",
    desc: "Закрепляем стоимость на\u00A0момент расчёта, чтобы инфляция не\u00A0увеличила смету.",
    icon: "shield",
  },
  {
    title: "Точный раскрой",
    desc: "Считаем листы и\u00A0доборные элементы под\u00A0ваш проект без\u00A0лишних остатков.",
    icon: "cut",
  },
  {
    title: "Готовые комплекты на\u00A0складе",
    desc: "Основные позиции держим в\u00A0наличии, чтобы вы не\u00A0ждали долгую поставку.",
    icon: "warehouse",
  },
  {
    title: "Экспертная комплектация с\u00A02008\u00A0года",
    desc: "Подбираем совместимые материалы и\u00A0узлы, чтобы кровля служила дольше.",
    icon: "expert",
  },
] as const;
