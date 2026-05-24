export type SkillTypeValue = 'FRONTEND' | 'BACKEND' | 'UI_UX';

export type Skill = {
  id: number;
  title: string;
  icon: string;
  type: SkillTypeValue;
};
