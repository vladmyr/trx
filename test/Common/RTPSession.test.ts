import test from "ava";
import { DataBuffer } from "../../src/Common/RTPSession";

class DataBufferTest extends DataBuffer {
    public calcBufferedSize() { return super._calcBufferedSize(); }
    public calcWriteCapacity() { return super._calcWriteCapacity(); }
    public calcWriteCapacityAppend() { return super._calcWriteCapacityAppend(); }
}

test("[DataBuffer] Buffer filling without read", async () => {

});

test("[DataBuffer] Circular buffer filling", async () => {

});