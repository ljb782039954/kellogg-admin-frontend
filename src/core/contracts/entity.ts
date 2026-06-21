export interface EntityCapabilities {
  list?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface EntityAdapter<Model, Dto, Input> {
  fromDto(dto: Dto): Model;
  toInput(model: Model): Input;
  toRequest(input: Input): unknown;
}

export interface EntityDefinition<
  Model = unknown,
  Dto = unknown,
  Input = unknown,
  Filters = unknown,
> {
  key: string;
  endpoint: string;
  adapter: EntityAdapter<Model, Dto, Input>;
  capabilities: EntityCapabilities;
  defaultFilters?: Filters;
  screens: {
    list?: string;
    editor?: string;
  };
}
