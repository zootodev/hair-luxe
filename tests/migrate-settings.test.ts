import { beforeEach, describe, expect, it } from "vitest";
import {
  getStoredSettings,
  migrateSettings,
  saveStoredSettings,
  storeConfigured,
} from "@/lib/store";
import { BUSINESS, DELIVERY_ZONES } from "@/lib/config";

/**
 * The exact settings row that was live in production before this fix
 * (captured from app_meta.key = 'settings'), with Toronto zones, a
 * deliveryFee of 15 and (416) phone numbers.
 */
const LEGACY_PRODUCTION_SETTINGS = {
  businessName: "Hair Luxe",
  tagline: "Where Luxury Meets Hair",
  email: "ifeoluwaniolufunmilayo@gmail.com",
  phone: "(416) 555-0199",
  phoneFormatted: "416-555-0199",
  address: "Lagos, Nigeria",
  city: "Lagos",
  hours: "Mon - Sat: 9:00 AM - 7:00 PM",
  bankDetails: {
    bankName: "GTBank",
    accountName: "Hair Luxe",
    accountNumber: "0123456789",
  },
  deliveryFee: 15,
  freeDeliveryOver: 250000,
  deliveryZones: [
    {
      name: "Local (Toronto)",
      zones: ["Toronto", "North York", "Scarborough", "Etobicoke", "York"],
      fee: 10,
      days: "1-2 business days",
    },
    {
      name: "GTA Region",
      zones: ["Mississauga", "Brampton", "Markham", "Vaughan", "Ajax", "Pickering"],
      fee: 15,
      days: "2-3 business days",
    },
    {
      name: "Other Ontario",
      zones: ["Ottawa", "Hamilton", "London", "Kitchener", "Waterloo"],
      fee: 25,
      days: "3-5 business days",
    },
  ],
  announcement: { enabled: false, text: "" },
};

async function seed(settings: Record<string, unknown>): Promise<void> {
  await saveStoredSettings(structuredClone(settings));
}

beforeEach(async () => {
  await seed({});
});

describe("settings migration (Toronto -> Lagos)", () => {
  it("runs against the in-memory store only", () => {
    expect(storeConfigured()).toBe(false);
  });

  it("migrates the legacy production payload on read", async () => {
    await seed(LEGACY_PRODUCTION_SETTINGS);

    const settings = await getStoredSettings();

    expect(settings.deliveryZones).toEqual(DELIVERY_ZONES);
    expect(settings.deliveryFee).toBe(DELIVERY_ZONES[0].fee);
    expect(settings.freeDeliveryOver).toBe(BUSINESS.freeDeliveryOver);
    expect(settings.phone).toBe(BUSINESS.phone);
    expect(settings.phoneFormatted).toBe(BUSINESS.phoneFormatted);
    // Already-Nigerian values are left alone.
    expect(settings.address).toBe(LEGACY_PRODUCTION_SETTINGS.address);
    expect(settings.city).toBe(LEGACY_PRODUCTION_SETTINGS.city);
  });

  it("persists the migration so the next read starts from Lagos data", async () => {
    await seed(LEGACY_PRODUCTION_SETTINGS);
    await getStoredSettings();

    const stored = await getStoredSettings();
    expect(stored.deliveryZones).toEqual(DELIVERY_ZONES);
    expect(stored.deliveryFee).toBe(DELIVERY_ZONES[0].fee);
  });

  it.each(["Local (Toronto)", "GTA Region", "Other Ontario", "Ontario"])(
    "detects the legacy zone %s even without the word Toronto",
    async (zoneName) => {
      await seed({
        deliveryZones: [{ name: zoneName, zones: [zoneName], fee: 10, days: "1-2 days" }],
      });

      const settings = await getStoredSettings();

      expect(settings.deliveryZones).toEqual(DELIVERY_ZONES);
    }
  );

  it("detects a legacy sub-zone even when the zone name is neutral", async () => {
    await seed({
      deliveryZones: [
        { name: "Express", zones: ["North York", "Toronto"], fee: 10, days: "1-2 days" },
      ],
    });

    const settings = await getStoredSettings();

    expect(settings.deliveryZones).toEqual(DELIVERY_ZONES);
  });

  it("replaces legacy tel and whatsapp phone fields even when the zones are already Lagos", async () => {
    await seed({
      deliveryZones: DELIVERY_ZONES,
      deliveryFee: 3000,
      phone: "416-555-0199",
      phoneFormatted: "+1 (416) 555-0199",
      whatsapp: "https://wa.me/14165550199",
      whatsappPhone: "+1 416 555 0199",
    });

    const settings = await getStoredSettings();

    expect(settings.phone).toBe(BUSINESS.phone);
    expect(settings.phoneFormatted).toBe(BUSINESS.phoneFormatted);
    expect(settings.whatsapp).toBe(BUSINESS.phone);
    expect(settings.whatsappPhone).toBe(BUSINESS.phone);
    expect(settings.deliveryZones).toEqual(DELIVERY_ZONES);
    expect(settings.deliveryFee).toBe(3000);
  });

  it("migrates city and address when they still carry a legacy marker", async () => {
    await seed({
      deliveryZones: DELIVERY_ZONES,
      city: "Toronto",
      address: "250 King St W, Ontario, Canada",
    });

    const settings = await getStoredSettings();

    expect(settings.city).toBe(BUSINESS.city);
    expect(settings.address).toBe(BUSINESS.address);
  });

  it("is idempotent: a second read does not rewrite or clobber the stored settings", async () => {
    await seed(LEGACY_PRODUCTION_SETTINGS);
    const migrated = await getStoredSettings();

    // An admin edits an already-migrated value; the migration must leave it alone.
    const customised = { ...migrated, phone: "+234 900 111 2222" };
    await seed(customised);

    expect(await getStoredSettings()).toEqual(customised);
    expect(await getStoredSettings()).toEqual(customised);
  });

  it("leaves non-legacy settings completely untouched", async () => {
    const custom = {
      businessName: "Bespoke Studio",
      deliveryZones: [
        { name: "Island Express", zones: ["Ikoyi", "Victoria Island"], fee: 2500, days: "same day" },
      ],
      deliveryFee: 2500,
      freeDeliveryOver: 100000,
      phone: "+234 911 222 3333",
      phoneFormatted: "+2349112223333",
      announcement: { enabled: true, text: "Free pickup this weekend" },
    };
    await seed(custom);

    expect(await getStoredSettings()).toEqual(custom);
  });

  it("migrates when called with no arguments (reads the store itself)", async () => {
    await seed(LEGACY_PRODUCTION_SETTINGS);

    const settings = await migrateSettings();

    expect(settings.deliveryZones).toEqual(DELIVERY_ZONES);
    expect(settings.phone).toBe(BUSINESS.phone);
  });

  it("returns the store untouched when there is nothing to migrate", async () => {
    const settings = await migrateSettings();
    expect(settings).toEqual({});
  });
});
