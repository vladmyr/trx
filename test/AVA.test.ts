import test from "ava";

const VALUE = "foo";
const fn = async () => Promise.resolve(VALUE);

test("AVA test environment setup verification", async (t) => {
    t.is(await fn(), VALUE);
})