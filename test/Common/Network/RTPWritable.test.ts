import test from "ava";

import * as Path from "path";
import { createReadStream } from "fs";
import RTPSession from "../../../src/Common/Network/RTPSession";
import RTPWritable from "../../../src/Common/Network/RTPWritable";
import RTPReadable from "../../../src/Common/Network/RTPReadable";

const PORT = 1373;

class RTPWritableTest extends RTPWritable {
    public constructor(port, rtpSession) {
        super(port);
        this._session = rtpSession;
    }
    protected _instantiateSession () {}
}

class RTPReadableTest extends RTPReadable {
    public constructor(port, destination, rtpSession) {
        super(port, destination);
        this._source = rtpSession;
    }
    protected _instantiateSession () {}
}

test("[RTPWritable] Read source from file and pipe it to network", async (t) => {
    const rtpSession = new RTPSession(PORT);

    
});