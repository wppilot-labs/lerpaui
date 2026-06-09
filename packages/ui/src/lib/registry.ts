export interface RegistryItem {
  name: string;
  type: 'component' | 'block';
  description: string;
  tags?: string[];
}

class ComponentRegistry {
  private items: Map<string, RegistryItem> = new Map();

  register(item: RegistryItem) {
    this.items.set(item.name, item);
  }

  get(name: string): RegistryItem | undefined {
    return this.items.get(name);
  }

  list(type?: 'component' | 'block'): RegistryItem[] {
    const all = Array.from(this.items.values());
    if (type) {
      return all.filter((item) => item.type === type);
    }
    return all;
  }
}

export const registry = new ComponentRegistry();
