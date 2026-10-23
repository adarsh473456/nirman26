import { Supplier, SearchFilterState } from '../types';
import {
  parseNaturalLanguageQuery,
  ParsedQuery,
} from './aiSearchEngine';

export interface RankedSupplierResult {
  supplier: Supplier;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  breakdown: {
    relevance: number; // max 40
    verification: number; // max 25
    profileCompleteness: number; // max 20
    responsiveness: number; // max 15
  };
}

export function rankSuppliers(
  suppliers: Supplier[],
  filters: SearchFilterState
): RankedSupplierResult[] {
  const normalizedQuery =
    filters.query.trim().toLowerCase();

  const parsed: ParsedQuery = filters.query.trim()
    ? parseNaturalLanguageQuery(filters.query)
    : {
      rawQuery: '',
      detectedCategories: [],
      detectedCertifications: [],
      detectedMaterials: [],
      detectedLocation: null,
      wantsFiveAxis: false,
      wantsLowMoq: false,
      wantsQuickTurn: false,
      cleanKeywords: [],
    };

  const results: RankedSupplierResult[] = [];

  for (const supplier of suppliers) {
    // 1. HARD FILTERS CHECK
    if (
      filters.verifiedOnly &&
      !supplier.verified
    ) {
      continue;
    }

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(
        supplier.category
      )
    ) {
      continue;
    }

    if (
      filters.location &&
      filters.location !==
      'All Locations'
    ) {
      const locMatch =
        supplier.location.city.toLowerCase() ===
        filters.location.toLowerCase() ||
        supplier.location.state.toLowerCase() ===
        filters.location.toLowerCase();

      if (!locMatch) {
        continue;
      }
    }

    if (
      filters.maxMoq &&
      supplier.moq >
      filters.maxMoq
    ) {
      continue;
    }

    if (
      filters.maxLeadTimeDays &&
      supplier.avgLeadTimeDays >
      filters.maxLeadTimeDays
    ) {
      continue;
    }

    if (
      filters.certifications.length >
      0
    ) {
      const suppCertCodes =
        supplier.certifications.map(
          c =>
            c.code.toUpperCase()
        );

      const hasCert =
        filters.certifications.some(
          reqCert =>
            suppCertCodes.some(
              c =>
                c.includes(
                  reqCert.toUpperCase()
                )
            )
        );

      if (!hasCert) {
        continue;
      }
    }

    // 2. WEIGHTED SCORING ENGINE
    let relevanceScore = 0;
    const matchReasons: string[] = [];

    const normalizedSupplierName =
      supplier.name
        .trim()
        .toLowerCase();

    /*
     * DIRECT COMPANY NAME MATCH
     *
     * Exact company-name search should always
     * receive maximum relevance.
     *
     * Example:
     * "DSATM" -> DSATM
     */
    const exactNameMatch =
      normalizedQuery.length > 0 &&
      normalizedSupplierName ===
      normalizedQuery;

    /*
     * Partial company-name search.
     *
     * Example:
     * "precision" ->
     * "PrecisionTech Dynamics"
     */
    const partialNameMatch =
      normalizedQuery.length > 0 &&
      !exactNameMatch &&
      normalizedSupplierName.includes(
        normalizedQuery
      );

    if (exactNameMatch) {
      relevanceScore = 40;

      matchReasons.push(
        'Exact supplier name match'
      );
    } else if (
      partialNameMatch
    ) {
      relevanceScore += 32;

      matchReasons.push(
        'Supplier name matches search'
      );
    } else {
      // Category match
      if (
        parsed.detectedCategories
          .length > 0
      ) {
        if (
          parsed.detectedCategories.includes(
            supplier.category
          )
        ) {
          relevanceScore += 15;

          matchReasons.push(
            `Matches core domain: ${supplier.category}`
          );
        }
      } else {
        relevanceScore += 10;
      }

      // Keyword & Machinery relevance
      const supplierText = [
        supplier.name,
        supplier.tagline,
        supplier.overview,
        ...supplier.subcategories,
        ...supplier.materials,
        ...supplier.machinery.map(
          m =>
            `${m.name} ${m.category} ${m.model}`
        ),
        ...supplier.certifications.map(
          c =>
            `${c.code} ${c.name}`
        ),
      ]
        .join(' ')
        .toLowerCase();

      if (
        parsed.cleanKeywords.length >
        0
      ) {
        let keywordHits = 0;

        for (const kw of parsed.cleanKeywords) {
          if (
            supplierText.includes(
              kw.toLowerCase()
            )
          ) {
            keywordHits++;
          }
        }

        const kwRatio =
          Math.min(
            1,
            keywordHits /
            Math.max(
              1,
              parsed.cleanKeywords
                .length
            )
          );

        relevanceScore +=
          kwRatio * 15;

        if (
          keywordHits > 0
        ) {
          matchReasons.push(
            `Matched ${keywordHits} search keyword terms`
          );
        }
      } else {
        relevanceScore += 15;
      }

      // Special intent match: 5-Axis
      if (parsed.wantsFiveAxis) {
        const has5Axis =
          supplier.machinery.some(
            m =>
              m.category
                .toLowerCase()
                .includes(
                  '5-axis'
                ) ||
              m.name
                .toLowerCase()
                .includes(
                  '5-axis'
                )
          );

        if (has5Axis) {
          relevanceScore += 10;

          matchReasons.push(
            'Equipped with verified 5-Axis CNC capability'
          );
        }
      }

      // Special intent match: Certifications
      if (
        parsed.detectedCertifications
          .length > 0
      ) {
        const suppCerts =
          supplier.certifications.map(
            c =>
              c.code.toLowerCase()
          );

        for (const reqCert of parsed.detectedCertifications) {
          if (
            suppCerts.some(
              sc =>
                sc.includes(
                  reqCert.toLowerCase()
                )
            )
          ) {
            relevanceScore += 5;

            matchReasons.push(
              `Certified: ${reqCert}`
            );
          }
        }
      }

      // Special intent match: Location
      if (
        parsed.detectedLocation
      ) {
        if (
          supplier.location.city.toLowerCase() ===
          parsed.detectedLocation.toLowerCase()
        ) {
          relevanceScore += 5;

          matchReasons.push(
            `Located in ${supplier.location.city}`
          );
        }
      }

      // Special intent match: Low MOQ
      if (
        parsed.wantsLowMoq &&
        supplier.moq <= 10
      ) {
        relevanceScore += 5;

        matchReasons.push(
          `Low prototyping MOQ: ${supplier.moq} pcs`
        );
      }
    }

    const finalRelevance =
      Math.min(
        40,
        Math.round(
          relevanceScore
        )
      );

    // Verification Score (max 25)
    let verificationScore = 0;

    if (
      supplier.verified &&
      supplier.verificationDetails
        .auditStatus ===
      'verified'
    ) {
      verificationScore = 25;

      matchReasons.push(
        'Verified Supplier Badge (GST & facility audited)'
      );
    } else if (
      supplier.verificationDetails
        .auditStatus ===
      'pending'
    ) {
      verificationScore = 10;
    }

    // Profile Completeness Score (max 20)
    let completenessScore = 0;

    if (
      supplier.machinery.length >= 2
    ) {
      completenessScore += 6;
    }

    if (
      supplier.certifications.length >=
      1
    ) {
      completenessScore += 6;
    }

    if (
      supplier.images.facility.length >=
      1
    ) {
      completenessScore += 4;
    }

    if (
      supplier.materials.length >= 3
    ) {
      completenessScore += 4;
    }

    const finalCompleteness =
      Math.min(
        20,
        completenessScore
      );

    // Responsiveness Score (max 15)
    let responsivenessScore = 0;

    if (
      supplier.responseRatePct >=
      95
    ) {
      responsivenessScore += 8;
    } else if (
      supplier.responseRatePct >=
      90
    ) {
      responsivenessScore += 5;
    }

    if (
      supplier.avgResponseTimeHours <=
      2.5
    ) {
      responsivenessScore += 7;
    } else if (
      supplier.avgResponseTimeHours <=
      5
    ) {
      responsivenessScore += 4;
    }

    const finalResponsiveness =
      Math.min(
        15,
        responsivenessScore
      );

    const totalMatchScore =
      Math.min(
        100,
        Math.round(
          finalRelevance +
          verificationScore +
          finalCompleteness +
          finalResponsiveness
        )
      );

    results.push({
      supplier: {
        ...supplier,
        matchScore:
          totalMatchScore,
        matchReasons:
          matchReasons.slice(
            0,
            3
          ),
      },

      matchScore:
        totalMatchScore,

      matchReasons:
        matchReasons.slice(
          0,
          3
        ),

      breakdown: {
        relevance:
          finalRelevance,

        verification:
          verificationScore,

        profileCompleteness:
          finalCompleteness,

        responsiveness:
          finalResponsiveness,
      },
    });
  }

  /*
   * SORTING PRIORITY
   *
   * 1. Exact company name match
   * 2. Partial company name match
   * 3. Existing ranking score
   */
  results.sort((a, b) => {
    if (
      normalizedQuery.length >
      0
    ) {
      const aName =
        a.supplier.name
          .trim()
          .toLowerCase();

      const bName =
        b.supplier.name
          .trim()
          .toLowerCase();

      const aExact =
        aName ===
        normalizedQuery;

      const bExact =
        bName ===
        normalizedQuery;

      if (
        aExact &&
        !bExact
      ) {
        return -1;
      }

      if (
        bExact &&
        !aExact
      ) {
        return 1;
      }

      const aPartial =
        aName.includes(
          normalizedQuery
        );

      const bPartial =
        bName.includes(
          normalizedQuery
        );

      if (
        aPartial &&
        !bPartial
      ) {
        return -1;
      }

      if (
        bPartial &&
        !aPartial
      ) {
        return 1;
      }
    }

    return (
      b.matchScore -
      a.matchScore
    );
  });

  return results;
}