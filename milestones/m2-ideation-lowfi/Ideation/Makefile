# Build the Ideation Report PDF.
#   make        build g3-ideation-report.pdf
#   make clean  remove build/ and the PDF
# Needs pandoc and xelatex (see FORMATTING_GUIDELINE.md, section 10).
# Run from this folder so image paths such as figures/x.png resolve.

SECTIONS := $(wildcard sections/*.md)
FRAGMENTS := $(patsubst sections/%.md,build/%.tex,$(SECTIONS))
PDF := g3-ideation-report.pdf

all: $(PDF)

build:
	mkdir -p build

build/%.tex: sections/%.md | build
	pandoc $< -f markdown -t latex -o $@

$(PDF): main.tex $(FRAGMENTS)
	xelatex -interaction=nonstopmode -halt-on-error -output-directory=build main.tex
	xelatex -interaction=nonstopmode -halt-on-error -output-directory=build main.tex
	cp build/main.pdf $(PDF)

clean:
	rm -rf build $(PDF)

.PHONY: all clean
