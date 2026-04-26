# Webhooks

For more information on how to use these endpoints see [setting-up-webhooks](https://developers.mobile-text-alerts.com/getting-started/setting-up-webhooks "mention") and [webhooks](https://developers.mobile-text-alerts.com/tutorials/webhooks "mention").

* Register Webhook [POST /webhooks](#register-webhook)
* List Webhooks [GET /webhooks](#list-webhooks)
* Update Webhook [PATCH /webhooks/{webhookId}](#update-a-webhook)
* Delete Webhook [DELETE /webhooks/{webhookId}](#delete-a-webhook)

{% hint style="info" %}
You will need the `{webhookId}` of the webhook you want to update/delete. The ids for all your registered webhooks can be found by calling the [List Webhooks endpoint](#list-webhooks).
{% endhint %}

## Register Webhook

<mark style="color:green;">`POST`</mark> <mark style="color:blue;">`/webhooks`</mark>

**Headers**

<table><thead><tr><th width="230">Name</th><th>Value</th></tr></thead><tbody><tr><td>Content-Type</td><td><code>application/json</code></td></tr><tr><td><a href="../../getting-started/get-an-api-key#bearer-token-authentication">Authorization</a></td><td><code>Bearer</code> <a href="../../getting-started/get-an-api-key#bearer-token-authentication"><code>&#x3C;APIKey></code></a></td></tr></tbody></table>

**Request Fields**

<table><thead><tr><th width="275">Name</th><th width="134">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>event</code><em>(required)</em></td><td><code>string</code></td><td>The <a href="#event-types">event type</a> to be registered: <code>message-reply</code>, <code>delivery-status</code>,<code>message-send</code> , or <code>number-opt-in</code>.</td></tr><tr><td><code>url</code><em>(required)</em></td><td><code>string</code></td><td><p>This is your hosted URL endpoint that Mobile Text Alerts will make a <code>POST</code> request to when events trigger. </p><p></p><p>The only requirement for this endpoint is that the response has a <mark style="color:green;"><code>200</code></mark> HTTP status code.</p></td></tr><tr><td><code>secret</code><em>(required)</em></td><td><code>string</code></td><td>This is shared secret between your organization and Mobile Text Alerts, used to authenticate webhook requests. Your webhook listener validates the value in the request with the shared secret. </td></tr><tr><td><code>alertEmail</code></td><td><code>string</code></td><td><p>The email address to be contacted for failure email alerts. </p><p></p><p>If an <code>alertEmail</code> is not configured but <code>sendAlertEmail</code>  is set to <code>true</code>, the account's main email will be used.</p></td></tr><tr><td><code>sendAlertEmail</code></td><td><code>boolean</code></td><td><p>Default value is <code>false</code> . </p><p></p><p> If <code>true</code>,  Mobile Text Alerts will send a <a href="#webhook-failure-email-alerts">failure alert email </a>to the configured <code>alertEmail</code> on the webhook. If<code>false</code> (or not supplied when registering the webhook) no failure email alerts will be sent.</p></td></tr><tr><td><code>skipErrors</code></td><td><code>boolean</code></td><td>If set to <code>true</code>, all error responses(non-<mark style="color:green;"><code>200</code></mark>) for requests to your configured URL will be ignored. If <a href="#webhook-failure-email-alerts">failure email alerts</a> are configured, they will not be triggered.</td></tr><tr><td><code>skipErrorCodes</code></td><td><code>string[]</code></td><td>This field can be used to indicate specific error codes to be ignored, failure email alerts will not be sent for these codes.</td></tr><tr><td><code>retryOnError</code></td><td><code>boolean</code></td><td><p>If set to <code>true</code>, a retry request will be made to your configured URL if the previous request resulted in an error response. Which responses are errors is determined by if <code>skipErrors</code> is enabled (all non-<mark style="color:green;"><code>200</code></mark> status codes ignored as errors) or <code>skipErrorCodes</code> (all specified error codes ignored as errors).</p><p></p><p>Mobile Text Alerts uses exponential backoff for retry calls, with up to <strong>2</strong> retry attempts.</p></td></tr><tr><td><code>maxThroughputPerMinute</code></td><td><code>number</code></td><td>Indicate the maximum number of requests that can be sent to the configured URL in a 60 second window.</td></tr></tbody></table>

**Example Request**

{% tabs %}
{% tab title="cURL" %}

```bash
curl --location --request POST 'https://api.mobile-text-alerts.com/v3/webhooks' \
  --header 'Authorization: Bearer <APIKey>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "event": "delivery-status",
    "url": "https://www.example.com/app/hooks",
    "secret": "abc123-abc2-cde1-1234-xyz123456",
    "alertEmail": "alert@example.com",
    "sendAlertEmail": true
}'
```

{% endtab %}

{% tab title="Node.js" %}
Requirements: Node.js `18+` (native `fetch`) and an `MTA_API_KEY` environment variable.

```js
async function main() {
  const response = await fetch('https://api.mobile-text-alerts.com/v3/webhooks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MTA_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event: 'delivery-status',
      url: 'https://www.example.com/app/hooks',
      secret: 'abc123-abc2-cde1-1234-xyz123456',
      alertEmail: 'alert@example.com',
      sendAlertEmail: true
    })
  });

  const data = await response.json();
  console.log(data);
}

main().catch((err) => {
  console.error('Request failed:', err);
  process.exitCode = 1;
});
```

{% endtab %}

{% tab title="Python" %}
Requirements: `pip install requests` and an `MTA_API_KEY` environment variable.

```python
import requests
import os

response = requests.post(
    'https://api.mobile-text-alerts.com/v3/webhooks',
    headers={
        'Authorization': f'Bearer {os.getenv("MTA_API_KEY")}',
        'Content-Type': 'application/json'
    },
    json={
        'event': 'delivery-status',
        'url': 'https://www.example.com/app/hooks',
        'secret': 'abc123-abc2-cde1-1234-xyz123456',
        'alertEmail': 'alert@example.com',
        'sendAlertEmail': True
    }
    )
print(response.json())
```

{% endtab %}
{% endtabs %}

**Response**

{% tabs %}
{% tab title="200" %}

```json
{
  "message": "Webhook 11 created successfully.",
  "data": {
    "id": 11,
    "event": "delivery-status",
    "url": "https://www.example.com/app/hooks",
    "alertEmail": "alert@example.com",
    "sendAlertEmail": true,
    "skipErrors": false,
    "skipErrorCodes": [],
    "retryOnError": true,
    "maxThroughputPerMinute": 600,
    "createdAt": "2022-04-18T05:00:00.000Z"
  }
}
```

{% endtab %}

{% tab title="400" %}

```json
{
  "httpCode": 400,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "bad_request_error",
  "name": "MTABadRequestError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}

{% tab title="401" %}

```json
{
  "httpCode": 401,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "unauthorized_error",
  "name": "MTAUnauthorizedError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}

{% tab title="403" %}

```json
{
  "httpCode": 403,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "forbidden_error",
  "name": "MTAForbiddenError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "reason": null
}
```

{% endtab %}

{% tab title="500" %}

```json
{
  "httpCode": 500,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "internal_server_error",
  "name": "MTAInternalServerError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}
{% endtabs %}

## List Webhooks

<mark style="color:green;">`GET`</mark> `/webhooks`&#x20;

You can view all the webhooks that have been configured for your account by calling the List Webhooks endpoint.

**Headers**

<table><thead><tr><th width="230">Name</th><th>Value</th></tr></thead><tbody><tr><td>Content-Type</td><td><code>application/json</code></td></tr><tr><td><a href="../../getting-started/get-an-api-key#bearer-token-authentication">Authorization</a></td><td><code>Bearer</code> <a href="../../getting-started/get-an-api-key#bearer-token-authentication"><code>&#x3C;APIKey></code></a></td></tr></tbody></table>

**Example Request**

{% tabs %}
{% tab title="cURL" %}

```bash
curl -L \
  -H 'Authorization: Bearer <APIKEY>' \
  'https://api.mobile-text-alerts.com/v3/webhooks'
```

{% endtab %}

{% tab title="Node.js" %}

```js
const response = await fetch(
  'https://api.mobile-text-alerts.com/v3/webhooks',
  {
    headers: {
      'Authorization': `Bearer ${process.env.MTA_API_KEY}`
    }
  }
);
```

{% endtab %}

{% tab title="Python" %}

```python
import requests
import os

response = requests.get(
    'https://api.mobile-text-alerts.com/v3/webhooks',
    headers={'Authorization': f'Bearer {os.getenv("MTA_API_KEY")}'}
)

```

{% endtab %}
{% endtabs %}

**Response**

{% tabs %}
{% tab title="200" %}

```json
{
  "data": {
    "rows": [
      {
        "id": 100,
        "event": "delivery-status",
        "url": "https://example.com/webhook/delivery",
        "alertEmail": "alert@example.com",
        "createdAt": "2021-01-01T00:00:00.000Z"
      },
      {
        "id": 101,
        "event": "message-reply",
        "url": "https://example.com/webhook/reply",
        "alertEmail": "alert@example.com",
        "createdAt": "2021-01-01T00:00:00.000Z"
      }
    ],
    "page": 0,
    "pageSize": 25,
    "total": 2
  }
}
```

{% endtab %}

{% tab title="400" %}

```json
{
  "httpCode": 400,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "bad_request_error",
  "name": "MTABadRequestError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}

{% tab title="401" %}

```json
{
  "httpCode": 401,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "unauthorized_error",
  "name": "MTAUnauthorizedError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}

{% tab title="403" %}

```json
{
  "httpCode": 403,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "forbidden_error",
  "name": "MTAForbiddenError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "reason": null
}
```

{% endtab %}

{% tab title="500" %}

```json
{
  "httpCode": 500,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "internal_server_error",
  "name": "MTAInternalServerError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}
{% endtabs %}

## Update Webhook

<mark style="color:purple;background-color:purple;">`PATCH`</mark> <mark style="color:blue;background-color:purple;">`/webhooks/{webhookId}`</mark>

You can edit an existing webhook you have created on your account by calling this endpoint. The path includes the `{webhookId}` of the webhook to be updated.

**Headers**

<table><thead><tr><th width="230">Name</th><th>Value</th></tr></thead><tbody><tr><td>Content-Type</td><td><code>application/json</code></td></tr><tr><td><a href="../../getting-started/get-an-api-key#bearer-token-authentication">Authorization</a></td><td><code>Bearer</code> <a href="../../getting-started/get-an-api-key#bearer-token-authentication"><code>&#x3C;APIKey></code></a></td></tr></tbody></table>

**Request Fields**

* `event: string` - Event type. One of: `message-reply`, `delivery-status`, `message-send`, `number-opt-in`.
* `url: string` - Your hosted endpoint URL that receives webhook `POST` requests.
* `secret: string` - Shared secret used to sign webhook requests.
* `alertEmail: string` - Email address to receive failure alerts.
* `sendAlertEmail: boolean` - If `true`, send failure alert emails.
* `skipErrors: boolean` - If `true`, ignore all non-`200` responses from your endpoint.
* `skipErrorCodes: string[]` - Error codes to ignore.
* `retryOnError: boolean` - If `true`, retry failed webhook requests (exponential backoff, up to 2 attempts).
* `maxThroughputPerMinute: number` - Max requests per 60-second window.

**Example Request**

{% tabs %}
{% tab title="cURL" %}

```bash
curl -L \
  --request PATCH \
  --url 'https://api.mobile-text-alerts.com/v3/webhooks/11' \
  --header 'Authorization: Bearer <APIKey>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "url": "https://www.example.com/app/hooks",
    "secret": "abc123-abc2-cde1-1234-xyz123456",
    "alertEmail": "alert@example.com",
    "sendAlertEmail": true,
    "maxThroughputPerMinute": 1000
}'
```

{% endtab %}

{% tab title="Node.js" %}
Requirements: Node.js `18+` (native `fetch`) and an `MTA_API_KEY` environment variable.

```js
async function main() {
  const response = await fetch('https://api.mobile-text-alerts.com/v3/webhooks/11', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.MTA_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: 'https://www.example.com/app/hooks',
      secret: 'abc123-abc2-cde1-1234-xyz123456',
      alertEmail: 'alert@example.com',
      sendAlertEmail: true,
      maxThroughputPerMinute: 1000
    })
  });

  const data = await response.json();
  console.log(data);
}

main().catch((err) => {
  console.error('Request failed:', err);
  process.exitCode = 1;
});
```

{% endtab %}

{% tab title="Python" %}
Requirements: `pip install requests` and an `MTA_API_KEY` environment variable.

```python
import requests
import os

response = requests.patch(
    'https://api.mobile-text-alerts.com/v3/webhooks/11',
    headers={
        'Authorization': f'Bearer {os.getenv("MTA_API_KEY")}',
        'Content-Type': 'application/json'
    },
    json={
        'url': 'https://www.example.com/app/hooks',
        'secret': 'abc123-abc2-cde1-1234-xyz123456',
        'alertEmail': 'alert@example.com',
        'sendAlertEmail': True,
        'maxThroughputPerMinute': 1000
    }
    )
print(response.json())
```

{% endtab %}
{% endtabs %}

**Response**

{% tabs %}
{% tab title="200" %}

```json
{
  "message": "Webhook 11 updated successfully.",
  "data": {
    "id": 11,
    "event": "delivery-status",
    "url": "https://www.example.com/app/hooks",
    "alertEmail": "alert@example.com",
    "sendAlertEmail": true,
    "skipErrors": false,
    "skipErrorCodes": [],
    "retryOnError": true,
    "maxThroughputPerMinute": 1000,
    "createdAt": "2022-04-18T05:00:00.000Z"
  }
}
```

{% endtab %}

{% tab title="400" %}

```json
{
  "httpCode": 400,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "bad_request_error",
  "name": "MTABadRequestError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}

{% tab title="401" %}

```json
{
  "httpCode": 401,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "unauthorized_error",
  "name": "MTAUnauthorizedError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}

{% tab title="403" %}

```json
{
  "httpCode": 403,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "forbidden_error",
  "name": "MTAForbiddenError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "reason": null
}
```

{% endtab %}

{% tab title="500" %}

```json
{
  "httpCode": 500,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "internal_server_error",
  "name": "MTAInternalServerError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}
{% endtabs %}

## Delete Webhook

<mark style="color:red;background-color:red;">`DELETE`</mark> <mark style="color:blue;background-color:red;">`/webhooks/{webhookId}`</mark>

Webhooks can be deleted without needing to supply a request body. Simply include the `{webhookId}` of the webhook to be deleted as a path parameter.

**Headers**

<table><thead><tr><th width="230">Name</th><th>Value</th></tr></thead><tbody><tr><td>Content-Type</td><td><code>application/json</code></td></tr><tr><td><a href="../../getting-started/get-an-api-key#bearer-token-authentication">Authorization</a></td><td><code>Bearer</code> <a href="../../getting-started/get-an-api-key#bearer-token-authentication"><code>&#x3C;APIKey></code></a></td></tr></tbody></table>

**Example Request**

{% tabs %}
{% tab title="cURL" %}

```bash
curl -L \
  --request DELETE \
  --url 'https://api.mobile-text-alerts.com/v3/webhooks/11' \
  --header 'Authorization: Bearer <APIKey>'
```

{% endtab %}

{% tab title="Node.js" %}

```js
const response = await fetch('https://api.mobile-text-alerts.com/v3/webhooks/11', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${process.env.MTA_API_KEY}`
  }
});

const data = await response.json();
console.log(data);
```

{% endtab %}

{% tab title="Python" %}

```python
import requests
import os

response = requests.delete(
    'https://api.mobile-text-alerts.com/v3/webhooks/11',
    headers={'Authorization': f'Bearer {os.getenv("MTA_API_KEY")}'}
)

print(response.json())
```

{% endtab %}
{% endtabs %}

**Response**

{% tabs %}
{% tab title="200" %}

```json
{
  "message": "Webhook 11 deleted successfully."
}
```

{% endtab %}

{% tab title="400" %}

```json
{
  "httpCode": 400,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "bad_request_error",
  "name": "MTABadRequestError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}

{% tab title="401" %}

```json
{
  "httpCode": 401,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "unauthorized_error",
  "name": "MTAUnauthorizedError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}

{% tab title="403" %}

```json
{
  "httpCode": 403,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "forbidden_error",
  "name": "MTAForbiddenError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "reason": null
}
```

{% endtab %}

{% tab title="500" %}

```json
{
  "httpCode": 500,
  "message": "text",
  "timestamp": "2026-02-10T03:37:28.425Z",
  "type": "internal_server_error",
  "name": "MTAInternalServerError",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

{% endtab %}
{% endtabs %}


---

# Agent Instructions: Querying This Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://developers.mobile-text-alerts.com/api-reference/webhooks.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.

---

How to test GoHighLevel (GHL):
To see the GHL integration in action, follow these steps:

Get your Webhook URL:

Go to Settings > GoHighLevel in Moe Limo.
You will see a Webhook URL (it looks like https://your-domain.com/webhooks/ghl). Copy it.
Set up the GHL Workflow:

Log in to your GoHighLevel account.
Go to Automation > Workflows and create a new workflow.
Trigger: Set the trigger to "Opportunity Created" (you can also add "Opportunity Changed" if you want updates to sync).
Action: Add the "Webhook" action.
Configuration: Paste the URL you copied from Moe Limo into the Webhook URL field.
Save & Publish: Make sure the workflow is published.
Trigger the Test:

Go to your Opportunities board in GHL and manually create a new test opportunity (add a name, email, and phone).
The moment you save it, a new ticket will automatically appear in your Moe Limo Inbox with the 🔗 GHL source badge.
Pro-Tip: If you move that opportunity to a different stage in GHL, Moe Limo will automatically add an internal note to the ticket saying "Stage changed to [New Stage]".

Ready to try creating that test opportunity in GHL?