const request = require("request-promise-native");
const fs = require("fs/promises");

const APIKEY =
  "10833dc37b6904a9ee719c8f4ba40c01724965ea993e56605603ff4cb54591a7";
const DYHOST = "https://dy-api.com";

async function choose(userId, sessionId, dyContext, selectors = []) {
  const options = {
    method: "POST",
    uri: `${DYHOST}/v2/serve/user/choose`,
    headers: {
      "DY-API-Key": APIKEY,
    },
    body: {
      selector: {
        names: selectors,
      },
      user: {
        id: userId,
      },
      session: {
        custom: sessionId,
      },
      context: dyContext,
    },
    json: true,
  };

  let variations = {};
  try {
    // console.log(options.body.selector);
    // console.log(options.body.user);
    // console.log(options.body.session);
    // console.log(options.body.context);
    const response = await request(options);
    variations = response.choices.reduce(flattenCampaignData, {});
    try {
      await fs.writeFile(
        "./views/recs.json",
        JSON.stringify(variations, null, 2)
      );
    } catch (err) {
      console.log(err);
    }
  } catch (e) {
    console.error(`ERROR IN CHOOSE: ${e.message}`);
  }
  return variations;
}

function flattenCampaignData(res, choice) {
  let data = null;
  if (choice.variations.length > 0) {
    switch (choice.type) {
      case "DECISION":
        data = {
          decisionId: choice.decisionId,
          ...choice.variations[0].payload.data,
        };
        break;
      case "RECS_DECISION":
        data = choice.variations[0].payload.data.slots.map((slot) => ({
          ...slot.productData,
          sku: slot.sku,
          slotId: slot.slotId,
        }));
        break;
      default:
        throw new Error("Unknown choice type: " + choice.type);
    }
  }

  res[choice.name] = data;
  return res;
}

async function reportClick(userId, sessionId, engagement) {
  try {
    const options = {
      method: "POST",
      url: `${DYHOST}/v2/collect/user/engagement`,
      headers: {
        "DY-API-Key": APIKEY,
      },
      body: {
        user: {
          id: userId,
        },
        session: {
          custom: sessionId,
        },
        engagements: [engagement],
      },
      json: true,
    };
    const response = await request(options);
    console.log("Engagement reported: " + JSON.stringify(engagement));
  } catch (e) {
    console.error(`ERROR IN ENGAGEMENT: ${e.message}`);
  }
}

async function reportEvent(userId, sessionId, event) {
  try {
    const options = {
      method: "POST",
      url: `${DYHOST}/v2/collect/user/event`,
      headers: {
        "DY-API-Key": APIKEY,
      },
      body: {
        user: {
          id: userId,
        },
        session: {
          custom: sessionId,
        },
        events: [event],
      },
      json: true,
    };
    const response = await request(options);
    console.log("Event reported: " + JSON.stringify(event));
  } catch (e) {
    console.error(`ERROR IN EVENT: ${e.message}`);
  }
}

module.exports = {
  choose,
  reportClick,
  reportEvent,
};
