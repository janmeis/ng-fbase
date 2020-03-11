export interface Item {
  name: string;
  value: number;
  comment: number;
}

export interface ItemWithRef extends Item {
  refId: string;
}
