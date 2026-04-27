# Tools

These scripts help you roll out shared standards to many projects.

## `bootstrap-product-repo.sh`

Creates:

- `docs/coding-standards/` (empty placeholder; you populate via submodule or copy)
- `AGENTS.md` in the product repo (if missing)
- `.cursor/rules/coding-standards.mdc` that always applies

Usage:

```bash
tools/bootstrap-product-repo.sh /abs/path/to/product-repo
```

## `update-standards-submodules.sh`

Updates standards submodules across multiple repos.

Usage:

```bash
tools/update-standards-submodules.sh /abs/path/to/REPOS.txt
```

Where `REPOS.txt` contains one absolute repo path per line.

