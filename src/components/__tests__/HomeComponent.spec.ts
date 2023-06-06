import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import HomeComponent from "../HomeComponent.vue";

describe("Welcome Home", () => {
  it("renders properly", () => {
    const wrapper = mount(HomeComponent);
    expect(wrapper.text()).toContain("Welcome Home");
  });
});