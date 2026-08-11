# Security policy

## Supported versions

| Version                        | Status                       |
| ------------------------------ | ---------------------------- |
| `main` / 0.3 release candidate | Supported before publication |
| 0.2.x                          | Supported                    |
| 0.1.x and older                | No longer supported          |

Security fixes are normally applied to the latest supported line. Backports are assessed case by case.

## Report a vulnerability

Do not open a public issue for a suspected vulnerability.

Use [GitHub private vulnerability reporting](https://github.com/wppilot-labs/lerpaui/security/advisories/new) when available, or email **security@lerpaui.com**. Include:

- affected package, version, item, or commit;
- reproduction steps or a minimal proof of concept;
- expected impact and required attacker access;
- any suggested remediation;
- whether the report or exploit details have been shared elsewhere.

We aim to acknowledge a report within 48 hours. Acknowledgement is not confirmation of impact or a fixed disclosure timeline. We will coordinate validation, remediation, release, and disclosure with the reporter where practical.

## Scope notes

The CLI writes source and can invoke the configured package manager. The MCP server is read-only and communicates over stdio. Reports involving path containment, dependency handling, generated registry integrity, unsafe item source, or protocol input validation are in scope.
