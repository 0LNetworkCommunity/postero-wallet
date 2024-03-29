import { Field, ObjectType } from "@nestjs/graphql";

export interface SettingsValue {
  accentColor: string;
}

@ObjectType("Settings")
class Settings {
  @Field()
  public accentColor: string;

  public init(value: SettingsValue) {
    this.accentColor = value.accentColor;
  }
}

export default Settings;
